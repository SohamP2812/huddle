import { Header } from "components/Header/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import {
  getUsersByQuery,
  resetUserQuery,
  selectUser,
} from "redux/slices/userSlice";
import {
  deleteMember,
  deleteTeam,
  addMember,
  getByUser,
  getMembers,
  getEvents,
  selectTeamById,
  selectMembers,
  selectEvents,
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
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { stringToJSDate } from "utils/misc";
import { useIsMounted } from "hooks/useIsMounted";

import { EventCard } from "components/EventCard/EventCard";

export const Team = () => {
  const isMounted = useIsMounted();

  const [usernameQuery, setUsernameQuery] = useState("");

  const [showPastEvents, setShowPastEvents] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();
  const { team_id } = useParams();

  const teams = useAppSelector(selectTeams);
  const user = useAppSelector(selectUser);
  const team = useAppSelector((state) =>
    selectTeamById(state, team_id ? parseInt(team_id) : undefined)
  );
  const members = useAppSelector(selectMembers);
  const events = useAppSelector(selectEvents);

  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    if (teams.teamDeletionSuccess && isMounted) navigate(`/teams`);
  }, [teams.teamDeletionSuccess]);

  useEffect(() => {
    if (teams.memberAddedSuccess && isMounted) {
      toast({
        title: teams.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  }, [teams.memberAddedSuccess]);

  useEffect(() => {
    if (teams.memberDeletionSuccess && isMounted) {
      toast({
        title: teams.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  }, [teams.memberDeletionSuccess]);

  useEffect(() => {
    user.user.id && dispatch(getByUser(user.user.id)); // we are getting all teams to get a single team. should use seperate slice for single team store.
    team_id && dispatch(getMembers(parseInt(team_id)));
    team_id && dispatch(getEvents(parseInt(team_id)));
  }, []);

  useEffect(() => {
    usernameQuery && dispatch(getUsersByQuery(usernameQuery));
  }, [usernameQuery]);

  const toggleShowPastEvents = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowPastEvents(!showPastEvents);
  };

  const handleCreateEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("create-event");
  };

  const handleUpdateUsernameQuery = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsernameQuery(e.target.value);
  };

  const handleOnClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setUsernameQuery("");
    dispatch(resetUserQuery());
    onClose();
  };

  const handleAddMember = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    user_id: number | null
  ) => {
    e.preventDefault();
    team_id &&
      user_id &&
      dispatch(
        addMember({
          team_id: parseInt(team_id),
          teamMemberInfo: { id: user_id },
        })
      );
  };

  const handleDeleteMember = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    user_id: number | null
  ) => {
    e.preventDefault();
    team_id &&
      user_id &&
      dispatch(
        deleteMember({
          user_id: user_id,
          team_id: parseInt(team_id),
        })
      );
  };

  const handleDeleteTeam = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    team_id && dispatch(deleteTeam(parseInt(team_id)));
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
                  {team?.name}
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack spacing={0} align={"center"} my={5}>
                <Heading fontSize={"lg"} fontWeight={500} fontFamily={"body"}>
                  {team?.manager.firstName} {team?.manager.lastName}
                </Heading>
                <Text color={"gray.500"}>{team?.manager.username}</Text>
              </Stack>
              <Stack align={"center"} justify={"center"} direction={"row"}>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue("gray.100", "gray.800")}
                  fontWeight={"700"}
                  textTransform={"none"}
                >
                  Manager
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
                    onClick={onOpen}
                  >
                    <AddIcon w={3} h={3} />
                    <Text>Add Member</Text>
                  </Flex>
                )}
              </Stack>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Team Members
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack my={5} gap={2}>
                {members
                  .filter((member) => member.id !== user.user.id)
                  .map((member) => (
                    <Stack
                      justify={"space-between"}
                      align="center"
                      direction="row"
                    >
                      <Text key={member.id} fontWeight={300} color={"gray.600"}>
                        {member.username}
                      </Text>
                      {member.id !== user.user.id &&
                        teams.members.find(
                          (member) => member.id === user.user.id
                        )?.isManager && (
                          <DeleteIcon
                            onClick={(e) => {
                              handleDeleteMember(e, member.id);
                            }}
                            _hover={{ cursor: "pointer", color: "red" }}
                            w={4}
                            h={4}
                          />
                        )}
                    </Stack>
                  ))}
              </Stack>
            </Box>
          </Box>
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
                    onClick={handleCreateEvent}
                  >
                    <AddIcon w={3} h={3} />
                    <Text>Create Event</Text>
                  </Flex>
                )}
              </Stack>
              <Stack spacing={0} align={"center"} mb={5} gap={2}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Schedule
                </Heading>
                <Checkbox
                  isChecked={showPastEvents}
                  onChange={toggleShowPastEvents}
                >
                  Show Past Events
                </Checkbox>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Flex direction="column" alignItems={"center"} my={5} gap={5}>
                {events
                  .filter(
                    (event) =>
                      stringToJSDate(event.endTime) > new Date() ||
                      showPastEvents
                  )
                  .sort(
                    (a, b) =>
                      stringToJSDate(b.startTime).getTime() -
                      stringToJSDate(a.startTime).getTime()
                  )
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </Flex>
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
            onClick={handleDeleteTeam}
          >
            Delete Team
          </Button>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Member List</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={10} id="participantIds">
                <FormLabel mb={0}>Username</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleUpdateUsernameQuery}
                  value={usernameQuery}
                />
              </FormControl>
              <Stack
                height={"fit-content"}
                h={"170px"}
                w={"full"}
                border={"1px"}
                borderColor={"gray.300"}
                rounded={"xl"}
                overflow={"scroll"}
                px={5}
                py={2}
              >
                {user.queryUsers
                  .filter(
                    (queriedUser) =>
                      queriedUser.id !== user.user.id &&
                      !members.some((members) => members.id === queriedUser.id)
                  )
                  .map((queriedUser) => (
                    <Box
                      p={2}
                      _hover={{ cursor: "pointer", bg: "gray.50" }}
                      onClick={(e) => handleAddMember(e, queriedUser.id)}
                    >
                      <Text key={queriedUser.id}>{queriedUser.username}</Text>
                      <Divider borderColor={"gray.300"} />
                    </Box>
                  ))}
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleOnClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};
