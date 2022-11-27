import React, { useState, useEffect } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Spacer,
  Select,
  useToast,
  Center,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import { eventTypes } from 'utils/consts';
import { getErrorMessage, isObjectDiff } from 'utils/misc';

import { BackButton } from 'components/BackButton/BackButton';
import {
  useGetEventsQuery,
  useGetParticipantsQuery,
  useUpdateEventMutation
} from 'redux/slices/apiSlice';

export const EditEvent = () => {
  const navigate = useNavigate();
  const { team_id, event_id } = useParams();
  const toast = useToast();

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEventsQuery(
    team_id ? parseInt(team_id) : 0,
    {
      skip: !team_id
    }
  );
  const event = event_id
    ? eventsResponse?.events.find((event) => event.id === parseInt(event_id))
    : null;
  const { data: participantsResponse } = useGetParticipantsQuery({
    teamId: team_id ? parseInt(team_id) : 0,
    eventId: event_id ? parseInt(event_id) : 0
  });
  const participants = participantsResponse?.eventParticipants ?? [];
  const [
    updateEvent,
    { error: updateEventError, isSuccess: isUpdateEventSuccess, isLoading: isUpdateEventLoading }
  ] = useUpdateEventMutation();

  useEffect(() => {
    if (isUpdateEventSuccess) {
      toast({
        title: 'Updated successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate(`/teams/${team_id}/events/${event_id}`);
    }
  }, [isUpdateEventSuccess]);

  useEffect(() => {
    if (updateEventError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(updateEventError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [updateEventError]);

  const [eventFields, setEventFields] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    eventType: string;
    teamScore: number;
    opponentScore: number;
  }>({
    name: '',
    startTime: dayjs().set('seconds', 0).format(),
    endTime: dayjs().set('seconds', 0).add(30, 'minutes').format(),
    eventType: 'GAME',
    teamScore: 0,
    opponentScore: 0
  });

  useEffect(() => {
    if (event) {
      setEventFields({
        ...eventFields,
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        eventType: event.eventType,
        teamScore: event.teamScore,
        opponentScore: event.opponentScore
      });
    }
  }, [event]);

  const handleChangeEventFields = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setEventFields({
      ...eventFields,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (team_id && event_id) {
      await updateEvent({
        teamId: parseInt(team_id),
        eventId: parseInt(event_id),
        updatedEvent: {
          ...eventFields,
          participantIds: participants
            .filter((participant) => participant.user.id)
            .map((participant) => participant.user.id!)
        }
      });
    }
  };

  const handleChangeStartTime = (newTime: string | null) => {
    newTime &&
      setEventFields({
        ...eventFields,
        startTime: dayjs(newTime).set('seconds', 0).format()
      });
  };

  const handleChangeEndTime = (newTime: string | null) => {
    newTime &&
      setEventFields({
        ...eventFields,
        endTime: dayjs(newTime).set('seconds', 0).format()
      });
  };

  if (isEventsLoading) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'xl'} py={12} px={6}>
          <BackButton fallback={`/teams/${team_id}/events/${event_id}`} />
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Update event</Heading>
          </Stack>
          <form onSubmit={handleUpdateEvent}>
            <Stack spacing={4}>
              <FormControl id="name">
                <FormLabel>Event Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeEventFields}
                  value={eventFields.name}
                />
              </FormControl>
              <FormControl id="eventType">
                <FormLabel>Event Type</FormLabel>
                <Select
                  name="eventType"
                  onChange={handleChangeEventFields}
                  value={eventFields.eventType}
                >
                  {Object.keys(eventTypes.nameToKey).map((eventType) => (
                    <option
                      key={eventType}
                      value={eventTypes.nameToKey[eventType as keyof typeof eventTypes.nameToKey]}
                    >
                      {eventType}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="times">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack direction={{ sm: 'column', md: 'row' }} gap={2} mt={3}>
                    <Stack w="full">
                      <DateTimePicker
                        label="Start Time"
                        value={eventFields.startTime}
                        onChange={handleChangeStartTime}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                    <Stack w="full">
                      <DateTimePicker
                        label="End Time"
                        value={eventFields.endTime}
                        onChange={handleChangeEndTime}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </Stack>
                </LocalizationProvider>
              </FormControl>
              <Spacer h={'xl'} />
              <Button
                isLoading={isUpdateEventLoading}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
                disabled={
                  !isObjectDiff(eventFields, {
                    name: event?.name,
                    startTime: event?.startTime,
                    endTime: event?.endTime,
                    eventType: event?.eventType,
                    teamScore: event?.teamScore,
                    opponentScore: event?.opponentScore
                  })
                }
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </>
  );
};
