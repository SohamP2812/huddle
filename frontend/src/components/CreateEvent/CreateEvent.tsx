import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
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

import { eventTypes } from "utils/consts";
import { toIsoString } from "utils/misc";
import { useIsMounted } from "hooks/useIsMounted";

export const CreateEvent = () => {
  const isMounted = useIsMounted();

  const navigate = useNavigate();
  const { team_id } = useParams();

  const toast = useToast();

  const teams = useAppSelector(selectTeams);
  const members = useAppSelector(selectMembers);

  const dispatch = useAppDispatch();

  const [allSelected, setAllSelected] = useState(false);

  const [eventFields, setEventFields] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    eventType: string;
    teamScore: number;
    opponentScore: number;
    participantIds: number[];
  }>({
    name: "",
    startTime: toIsoString(new Date()),
    endTime: toIsoString(new Date()),
    eventType: "GAME",
    teamScore: 0,
    opponentScore: 0,
    participantIds: [],
  });

  useEffect(() => {
    team_id && dispatch(getMembers(parseInt(team_id)));
  }, []);

  useEffect(() => {
    if (teams.eventCreationSuccess && isMounted) navigate(`/teams/${team_id}`);
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
      const allMembersIds = members.map((member) => member.id);

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
        createEvent({ id: parseInt(team_id), eventCreationInfo: eventFields })
      );
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
              <FormControl id="sport">
                <FormLabel>Sport</FormLabel>
                <Select
                  name="eventType"
                  onChange={handleChangeEventFields}
                  defaultValue={"GAME"}
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
                    {members.map((member) => (
                      <Checkbox
                        name={member.id.toString()}
                        isChecked={eventFields.participantIds.includes(
                          member.id
                        )}
                        onChange={handleSelectParticipant}
                      >
                        {member.username}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </Stack>
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
