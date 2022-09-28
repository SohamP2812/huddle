import { Header } from "components/Header/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import {
  getByUser,
  getMembers,
  getEvents,
  getParticipants,
  updateParticipant,
  updateEvent,
  selectEventById,
  selectMembers,
  selectParticipants,
} from "redux/slices/teamsSlice";
import {
  Heading,
  Box,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  Badge,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import dayjs from "dayjs";

import { stringToJSDate } from "utils/misc";
import { isArrayDiff } from "utils/misc";

export const Event = () => {
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
    startTime: dayjs().set("seconds", 0).format(),
    endTime: dayjs().set("seconds", 0).add(30, "minutes").format(),
    eventType: "GAME",
    teamScore: 0,
    opponentScore: 0,
    participantIds: [],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { team_id, event_id } = useParams();

  const [status, setStatus] = useState<string>("UNDECIDED");

  const user = useAppSelector(selectUser);
  const event = useAppSelector((state) =>
    selectEventById(state, event_id ? parseInt(event_id) : undefined)
  );
  const members = useAppSelector(selectMembers);
  const participants = useAppSelector(selectParticipants);

  const dispatch = useAppDispatch();

  useEffect(() => {
    user.id && dispatch(getByUser(user.id));
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

  useEffect(() => {
    setStatus(getPersistentStatus());
    setEventFields({
      ...eventFields,
      participantIds: participants.map((participant) => participant.user.id),
    });
  }, [participants]);

  const getPersistentStatus = () => {
    return (
      participants.find((participant) => participant.user.id === user.id)
        ?.attendance ?? "UNDECIDED"
    );
  };

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setStatus(e.target.value);
  };

  const handleUpdateParticipant = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    team_id &&
      event_id &&
      user.id &&
      dispatch(
        updateParticipant({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
          user_id: user.id,
          participantUpdateInfo: { attendance: status },
        })
      );
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

  const handleOnClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAllSelected(false);
    setEventFields({
      ...eventFields,
      participantIds: participants.map((participant) => participant.user.id),
    });
    onClose();
  };

  const handleUpdateEvent = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (team_id && event_id) {
      const result = await dispatch(
        updateEvent({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
          eventUpdateInfo: eventFields,
        })
      );
      if (updateEvent.fulfilled.match(result)) {
        await dispatch(
          getParticipants({
            team_id: parseInt(team_id),
            event_id: parseInt(event_id),
          })
        );
        onClose();
      }
    }
  };

  return (
    <>
      <Header />
      <Flex
        alignItems={"center"}
        minH={"100vh"}
        bg={useColorModeValue("gray.50", "gray.800")}
        py={20}
        px={10}
        direction={"column"}
        gap={10}
      >
        <Flex maxW={"1000px"} w={"full"}>
          <Box
            height={"fit-content"}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"xl"}
            overflow={"hidden"}
          >
            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  {event?.name}
                </Heading>
              </Stack>
              <Stack
                align={"center"}
                justify={"center"}
                direction={"row"}
                mt={5}
              >
                <Badge px={2} py={1} fontWeight={"700"} textTransform={"none"}>
                  {event?.eventType}
                </Badge>
              </Stack>
            </Box>
          </Box>
        </Flex>
        <Flex
          direction={{ sm: "column", md: "row" }}
          maxW={"1000px"}
          w={"full"}
          gap={5}
        >
          <Box
            minH={"fit-content"}
            w={{ sm: "100%", md: "60%" }}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"xl"}
            overflow={"hidden"}
          >
            <Box p={6}>
              <Stack
                direction={"row"}
                justifyContent="right"
                color="blue.400"
                mb={"2"}
              ></Stack>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Score
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack
                justify={"space-evenly"}
                textAlign={"center"}
                direction={"row"}
                mt={7}
              >
                {stringToJSDate(event?.endTime ?? "") < new Date() ? (
                  <>
                    <Stack direction={"column"}>
                      <Heading fontSize={"xxx-large"}>
                        {event?.teamScore}
                      </Heading>
                      <Text>Team Score</Text>
                    </Stack>
                    <Stack direction={"column"}>
                      <Heading fontSize={"xxx-large"}>
                        {event?.opponentScore}
                      </Heading>
                      <Text>Opponent Score</Text>
                    </Stack>
                  </>
                ) : (
                  <Badge
                    px={2}
                    py={1}
                    fontWeight={"700"}
                    textTransform={"none"}
                  >
                    TBD
                  </Badge>
                )}
              </Stack>
            </Box>
          </Box>
          <Box
            minH={"fit-content"}
            w={{ sm: "100%", md: "40%" }}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"xl"}
            overflow={"hidden"}
          >
            <Stack p={6} h={"full"}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Time
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack
                spacing={0}
                align={"center"}
                flex={"1 1 auto"}
                justifyContent={"center"}
              >
                <Text color={"gray.500"} fontSize={"xl"}>
                  Start: {stringToJSDate(event?.endTime ?? "").toLocaleString()}
                </Text>
                <Text color={"gray.500"} fontSize={"xl"}>
                  End: {stringToJSDate(event?.endTime ?? "").toLocaleString()}
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Flex>
        <Flex
          direction={{ sm: "column", md: "row" }}
          maxW={"1000px"}
          w={"full"}
          gap={5}
        >
          <Box
            height={"fit-content"}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"xl"}
            overflow={"hidden"}
          >
            <Box p={6}>
              <Flex direction={"column"} align={"center"} mb={5} gap={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Participants
                </Heading>
                <Button mb={5} onClick={onOpen}>
                  Update Participants
                </Button>
              </Flex>
              <Divider borderColor={"gray.300"} />
              <Stack align={"center"} my={5} gap={5}>
                <FormControl>
                  <FormLabel>Your Status</FormLabel>
                  <Stack direction={"row"}>
                    <Select
                      onChange={handleChangeStatus}
                      value={status}
                      defaultValue={"UNDECIDED"}
                    >
                      <option key={"UNDECIDED"} value={"UNDECIDED"}>
                        UNDECIDED
                      </option>
                      <option key={"YES"} value={"YES"}>
                        YES
                      </option>
                      <option key={"NO"} value={"NO"}>
                        NO
                      </option>
                    </Select>
                    <Button
                      onClick={handleUpdateParticipant}
                      disabled={status === getPersistentStatus()}
                    >
                      Update
                    </Button>
                  </Stack>
                </FormControl>
                <Stack
                  width={"full"}
                  direction={{ sm: "column", md: "row" }}
                  justifyContent={"space-evenly"}
                  textAlign={"center"}
                  gap={{ sm: 10, md: 5 }}
                >
                  <Stack
                    w={"full"}
                    gap={3}
                    border={"1px"}
                    borderColor={"gray.300"}
                    rounded={"xl"}
                    py={5}
                  >
                    <Heading fontSize={"2xl"}>YES</Heading>
                    <Divider borderColor={"gray.300"} />
                    {participants
                      .filter((participant) => participant.attendance === "YES")
                      .map((participant) => (
                        <Text
                          fontWeight={
                            participant.user.id === user.id ? 600 : 300
                          }
                          color={
                            participant.user.id === user.id
                              ? "gray.900"
                              : "gray.600"
                          }
                        >
                          {participant.user.username}
                        </Text>
                      ))}
                  </Stack>
                  <Stack
                    w={"full"}
                    gap={3}
                    border={"1px"}
                    borderColor={"gray.300"}
                    rounded={"xl"}
                    py={5}
                  >
                    <Heading fontSize={"2xl"}>NO</Heading>
                    <Divider borderColor={"gray.300"} />
                    {participants
                      .filter((participant) => participant.attendance === "NO")
                      .map((participant) => (
                        <Text
                          fontWeight={
                            participant.user.id === user.id ? 600 : 300
                          }
                          color={
                            participant.user.id === user.id
                              ? "gray.900"
                              : "gray.600"
                          }
                        >
                          {participant.user.username}
                        </Text>
                      ))}
                  </Stack>
                  <Stack
                    w={"full"}
                    gap={3}
                    border={"1px"}
                    borderColor={"gray.300"}
                    rounded={"xl"}
                    py={5}
                  >
                    <Heading fontSize={"2xl"}>UNDECIDED</Heading>
                    <Divider borderColor={"gray.300"} />
                    {participants
                      .filter(
                        (participant) => participant.attendance === "UNDECIDED"
                      )
                      .map((participant) => (
                        <Text
                          fontWeight={
                            participant.user.id === user.id ? 600 : 300
                          }
                          color={
                            participant.user.id === user.id
                              ? "gray.900"
                              : "gray.600"
                          }
                        >
                          {participant.user.username}
                        </Text>
                      ))}
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleOnClose}>
                Close
              </Button>
              <Button
                disabled={
                  !isArrayDiff(
                    eventFields.participantIds,
                    participants.map((participant) => participant.user.id)
                  )
                }
                colorScheme="blue"
                onClick={handleUpdateEvent}
              >
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
