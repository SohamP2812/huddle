import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
import { selectUser } from "redux/slices/userSlice";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import {
  createEvent,
  getMembers,
  selectTeams,
  selectMembers,
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

import { BackButton } from "components/BackButton/BackButton";

export const CreateEvent = () => {
  const isMounted = useIsMounted();

  const navigate = useNavigate();
  const { team_id } = useParams();

  const toast = useToast();

  const teams = useAppSelector(selectTeams);
  const members = useAppSelector(selectMembers);
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [allSelected, setAllSelected] = useState(false);

  const [eventFields, setEventFields] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    eventType: string;
    teamScore: number;
    opponentScore: number;
    participantIds: (number | null)[];
  }>({
    name: "",
    startTime: dayjs().set("seconds", 0).format(),
    endTime: dayjs().set("seconds", 0).add(30, "minutes").format(),
    eventType: "GAME",
    teamScore: 0,
    opponentScore: 0,
    participantIds: [],
  });

  useEffect(() => {
    team_id && dispatch(getMembers(parseInt(team_id)));
  }, []);

  useEffect(() => {
    if (teams.eventCreationSuccess && isMounted) {
      toast({
        title: teams.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/teams/${team_id}`);
    }
  }, [teams.eventCreationSuccess]);

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

  const handleSelectParticipant = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (allSelected) setAllSelected(false);

    let tempParticipantIds = eventFields.participantIds;

    if (tempParticipantIds.includes(parseInt(e.target.name))) {
      tempParticipantIds = tempParticipantIds.filter(
        (id) => id !== parseInt(e.target.name)
      );
    } else {
      tempParticipantIds.push(parseInt(e.target.name));
    }

    setEventFields({
      ...eventFields,
      participantIds: tempParticipantIds,
    });
  };

  const handleSelectAllParticipants = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (allSelected) {
      setEventFields({
        ...eventFields,
        participantIds: [],
      });
    } else {
      const allMembersIds = members
        .filter((member) => member.id !== user.user.id)
        .map((member) => member.id);

      setEventFields({
        ...eventFields,
        participantIds: allMembersIds,
      });
    }
    setAllSelected(!allSelected);
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    team_id &&
      dispatch(
        createEvent({
          id: parseInt(team_id),
          eventCreationInfo: {
            ...eventFields,
            participantIds: [...eventFields.participantIds, user.user.id],
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
          <BackButton fallback={`/teams/${team_id}`} />
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create an event</Heading>
          </Stack>
          <form onSubmit={handleCreateEvent}>
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
              <FormControl id="participantIds">
                <Flex mb={"0.5rem"}>
                  <FormLabel mb={0}>Participants</FormLabel>
                  <Checkbox
                    isChecked={allSelected}
                    onChange={handleSelectAllParticipants}
                  >
                    Select All
                  </Checkbox>
                </Flex>
                <Stack
                  height={"fit-content"}
                  minH={"50px"}
                  maxH={"200px"}
                  w={"full"}
                  border={"1px"}
                  borderColor={"gray.300"}
                  rounded={"xl"}
                  overflow={"scroll"}
                  px={5}
                  py={2}
                >
                  <CheckboxGroup>
                    {members
                      .filter((member) => member.id !== user.user.id)
                      .map((member) => (
                        <>
                          {member.id && (
                            <Checkbox
                              name={member.id.toString()}
                              isChecked={eventFields.participantIds.includes(
                                member.id
                              )}
                              onChange={handleSelectParticipant}
                            >
                              {member.username}
                            </Checkbox>
                          )}
                        </>
                      ))}
                  </CheckboxGroup>
                </Stack>
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
