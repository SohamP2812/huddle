import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import {
  getMembers,
  getEvents,
  getParticipants,
  updateEvent,
  selectEventById,
  selectParticipants,
  selectTeams,
} from "redux/slices/teamsSlice";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  Spacer,
  Select,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import { eventTypes } from "utils/consts";
import { useIsMounted } from "hooks/useIsMounted";
import { isObjectDiff } from "utils/misc";

export const EditEvent = () => {
  const isMounted = useIsMounted();

  const navigate = useNavigate();
  const { team_id, event_id } = useParams();

  const toast = useToast();

  const event = useAppSelector((state) =>
    selectEventById(state, event_id ? parseInt(event_id) : undefined)
  );
  const participants = useAppSelector(selectParticipants);
  const teams = useAppSelector(selectTeams);

  const dispatch = useAppDispatch();

  const [eventFields, setEventFields] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    eventType: string;
    teamScore: number;
    opponentScore: number;
  }>({
    name: "",
    startTime: dayjs().set("seconds", 0).format(),
    endTime: dayjs().set("seconds", 0).add(30, "minutes").format(),
    eventType: "GAME",
    teamScore: 0,
    opponentScore: 0,
  });

  useEffect(() => {
    team_id && dispatch(getMembers(parseInt(team_id)));
    team_id && dispatch(getEvents(parseInt(team_id)));
    team_id &&
      event_id &&
      dispatch(
        getParticipants({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
        })
      );
  }, []);

  useEffect(() => {
    if (teams.eventUpdateSuccess && isMounted)
      navigate(`/teams/${team_id}/events/${event_id}`);
  }, [teams.eventUpdateSuccess]);

  useEffect(() => {
    if (teams.error && isMounted) {
      toast({
        title: "An error occurred!",
        description: teams.error,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [teams.error]);

  useEffect(() => {
    event &&
      setEventFields({
        ...eventFields,
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        eventType: event.eventType,
        teamScore: event.teamScore,
        opponentScore: event.opponentScore,
      });
  }, [event]);

  const handleChangeEventFields = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setEventFields({
      ...eventFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (team_id && event_id)
      dispatch(
        updateEvent({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
          eventUpdateInfo: {
            ...eventFields,
            participantIds: participants.map(
              (participant) => participant.user.id
            ),
          },
        })
      );
  };

  const handleChangeStartTime = (newTime: string | null) => {
    newTime &&
      setEventFields({
        ...eventFields,
        startTime: dayjs(newTime).set("seconds", 0).format(),
      });
  };

  const handleChangeEndTime = (newTime: string | null) => {
    newTime &&
      setEventFields({
        ...eventFields,
        endTime: dayjs(newTime).set("seconds", 0).format(),
      });
  };

  return (
    <>
      <Header />
      <Flex
        minH={"100vh"}
        pt={10}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} width={"xl"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Update event</Heading>
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
                      value={
                        eventTypes.nameToKey[
                          eventType as keyof typeof eventTypes.nameToKey
                        ]
                      }
                    >
                      {eventType}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="times">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack direction={{ sm: "column", md: "row" }} gap={2} mt={3}>
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
              <Spacer h={"xl"} />
              <Button
                type="submit"
                bg={"black"}
                color={"white"}
                _hover={{
                  bg: "gray.600",
                }}
                disabled={
                  !isObjectDiff(eventFields, {
                    name: event?.name,
                    startTime: event?.startTime,
                    endTime: event?.endTime,
                    eventType: event?.eventType,
                    teamScore: event?.teamScore,
                    opponentScore: event?.opponentScore,
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
