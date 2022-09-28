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
} from "@chakra-ui/react";

import { stringToJSDate } from "utils/misc";

export const Event = () => {
  const navigate = useNavigate();
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

  const getPersistentStatus = () => {
    return (
      participants.find((participant) => participant.user.id === user.id)
        ?.attendance ?? "UNDECIDED"
    );
  };

  useEffect(() => {
    setStatus(getPersistentStatus());
  }, [participants]);

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
              <Stack spacing={0} align={"center"} mb={5} gap={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Participants
                </Heading>
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
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack align={"center"} my={5} gap={2}>
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
      </Flex>
    </>
  );
};
