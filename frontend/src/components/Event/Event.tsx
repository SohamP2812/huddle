import { Header } from "components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import {
  getByUser,
  getMembers,
  getEvents,
  getParticipants,
  updateParticipant,
  updateEvent,
  deleteEvent,
  selectEventById,
  selectMembers,
  selectParticipants,
  selectTeams,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";

import { stringToJSDate } from "utils/misc";
import { isArrayDiff } from "utils/misc";
import { useIsMounted } from "hooks/useIsMounted";

import { BackButton } from "components/BackButton/BackButton";

export const Event = () => {
  const isMounted = useIsMounted();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateScoreOpen,
    onOpen: onUpdateScoreOpen,
    onClose: onUpdateScoreClose,
  } = useDisclosure();

  const navigate = useNavigate();
  const { team_id, event_id } = useParams();

  const [status, setStatus] = useState<string>("UNDECIDED");

  const user = useAppSelector(selectUser);
  const event = useAppSelector((state) =>
    selectEventById(state, event_id ? parseInt(event_id) : undefined)
  );
  const members = useAppSelector(selectMembers);
  const participants = useAppSelector(selectParticipants);
  const teams = useAppSelector(selectTeams);

  const dispatch = useAppDispatch();

  const toast = useToast();

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
    if (teams.eventDeletionSuccess && isMounted) navigate(`/teams/${team_id}`);
  }, [teams.eventDeletionSuccess]);

  useEffect(() => {
    if (teams.eventUpdateSuccess && isMounted) {
      toast({
        title: teams.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [teams.eventUpdateSuccess]);

  useEffect(() => {
    if (teams.participantUpdateSuccess && isMounted) {
      toast({
        title: teams.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [teams.participantUpdateSuccess]);

  useEffect(() => {
    user.user.id && dispatch(getByUser(user.user.id));
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
      setEventFields((prevState) => ({
        ...prevState,
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        eventType: event.eventType,
        teamScore: event.teamScore,
        opponentScore: event.opponentScore,
      }));
  }, [event]);

  useEffect(() => {
    setStatus(getPersistentStatus());
    setEventFields((prevState) => ({
      ...prevState,
      participantIds: participants
        .filter((member) => member.user.id !== user.user.id)
        .map((participant) => participant.user.id),
    }));
  }, [participants]);

  const getPersistentStatus = () => {
    return (
      participants.find((participant) => participant.user.id === user.user.id)
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
      user.user.id &&
      dispatch(
        updateParticipant({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
          user_id: user.user.id,
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
          eventUpdateInfo: {
            ...eventFields,
            participantIds: [...eventFields.participantIds, user.user.id],
          },
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
        onUpdateScoreClose();
      }
    }
  };

  const toUpdateEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate("edit");
  };

  const handleDeleteEvent = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    team_id &&
      event_id &&
      dispatch(
        deleteEvent({
          team_id: parseInt(team_id),
          event_id: parseInt(event_id),
        })
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
        <Stack
          spacing={8}
          mx={"auto"}
          width={"5xl"}
          py={12}
          px={6}
          gap={1}
          direction={"column"}
        >
          <BackButton fallback={`/teams/${team_id}`} />
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
                <Stack
                  direction={"row"}
                  justifyContent="right"
                  color="blue.400"
                  mb={"2"}
                >
                  {teams.members.find((member) => member.id === user.user.id)
                    ?.isManager && (
                    <Flex
                      gap={2}
                      alignItems={"center"}
                      _hover={{
                        cursor: "pointer",
                      }}
                      onClick={toUpdateEvent}
                    >
                      <EditIcon w={3} h={3} />
                      <Text>Edit Event</Text>
                    </Flex>
                  )}
                </Stack>
                <Stack spacing={0} align={"center"} mb={5}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={800}
                    fontFamily={"body"}
                  >
                    {event?.name}
                  </Heading>
                </Stack>
                <Stack
                  align={"center"}
                  justify={"center"}
                  direction={"row"}
                  mt={5}
                >
                  <Badge
                    px={2}
                    py={1}
                    fontWeight={"700"}
                    textTransform={"none"}
                  >
                    {event?.eventType}
                  </Badge>
                </Stack>
              </Box>
            </Box>
          </Flex>
          <Flex
            direction={{ base: "column", md: "row" }}
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
                <Stack spacing={0} align={"center"} mb={5}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={800}
                    fontFamily={"body"}
                  >
                    Score
                  </Heading>
                </Stack>
                <Divider borderColor={"gray.300"} />
                <Stack
                  justify={"space-evenly"}
                  textAlign={"center"}
                  direction={"row"}
                  mt={7}
                  mb={10}
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
                {stringToJSDate(event?.endTime ?? "") < new Date() &&
                  teams.members.find((member) => member.id === user.user.id)
                    ?.isManager && (
                    <Flex justifyContent={"center"}>
                      <Button mb={5} onClick={onUpdateScoreOpen}>
                        Update Score
                      </Button>
                    </Flex>
                  )}
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
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={800}
                    fontFamily={"body"}
                  >
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
                    Start:{" "}
                    {stringToJSDate(event?.startTime ?? "").toLocaleString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text color={"gray.500"} fontSize={"xl"}>
                    End:{" "}
                    {stringToJSDate(event?.endTime ?? "").toLocaleString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Flex>
          <Flex
            direction={{ base: "column", md: "row" }}
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
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={800}
                    fontFamily={"body"}
                  >
                    Participants
                  </Heading>
                  {teams.members.find((member) => member.id === user.user.id)
                    ?.isManager && (
                    <Button mb={5} onClick={onOpen}>
                      Update Participants
                    </Button>
                  )}
                </Flex>
                <Divider borderColor={"gray.300"} />
                <Stack align={"center"} my={5} gap={5}>
                  <FormControl>
                    <FormLabel>Your Status</FormLabel>
                    <Stack direction={"row"}>
                      <Select onChange={handleChangeStatus} value={status}>
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
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"space-evenly"}
                    textAlign={"center"}
                    gap={{ base: 10, md: 5 }}
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
                        .filter(
                          (participant) => participant.attendance === "YES"
                        )
                        .map((participant) => (
                          <Text
                            key={participant.id}
                            fontWeight={
                              participant.user.id === user.user.id ? 600 : 300
                            }
                            color={
                              participant.user.id === user.user.id
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
                        .filter(
                          (participant) => participant.attendance === "NO"
                        )
                        .map((participant) => (
                          <Text
                            key={participant.id}
                            fontWeight={
                              participant.user.id === user.user.id ? 600 : 300
                            }
                            color={
                              participant.user.id === user.user.id
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
                          (participant) =>
                            participant.attendance === "UNDECIDED"
                        )
                        .map((participant) => (
                          <Text
                            key={participant.id}
                            fontWeight={
                              participant.user.id === user.user.id ? 600 : 300
                            }
                            color={
                              participant.user.id === user.user.id
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
          {teams.members.find((member) => member.id === user.user.id)
            ?.isManager && (
            <Button
              mb={5}
              p={4}
              py={6}
              bg="red"
              color="white"
              _hover={{ bg: "red.400" }}
              onClick={handleDeleteEvent}
              width={"fit-content"}
              alignSelf="center"
            >
              Delete Event
            </Button>
          )}
          <Modal isOpen={isUpdateScoreOpen} onClose={onUpdateScoreClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update Score</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="participantIds">
                  <FormLabel mb={0}>Team Score</FormLabel>
                  <NumberInput
                    value={eventFields.teamScore}
                    mb={2}
                    min={0}
                    onChange={(_, value) => {
                      setEventFields({ ...eventFields, teamScore: value });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormLabel mb={0}>Opponent Score</FormLabel>
                  <NumberInput
                    value={eventFields.opponentScore}
                    min={0}
                    onChange={(_, value) => {
                      setEventFields({ ...eventFields, opponentScore: value });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onUpdateScoreClose}>
                  Close
                </Button>
                <Button
                  disabled={
                    eventFields.opponentScore === event?.opponentScore &&
                    eventFields.teamScore === event?.teamScore
                  }
                  colorScheme="blue"
                  onClick={handleUpdateEvent}
                >
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update Participant List</ModalHeader>
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
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleOnClose}>
                  Close
                </Button>
                <Button
                  disabled={
                    !isArrayDiff(
                      eventFields.participantIds.filter(
                        (id) => id !== user.user.id
                      ),
                      participants
                        .filter((member) => member.user.id !== user.user.id)
                        .map((participant) => participant.user.id)
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
        </Stack>
      </Flex>
    </>
  );
};
