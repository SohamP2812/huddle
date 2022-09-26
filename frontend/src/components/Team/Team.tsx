import { Header } from "components/Header/Header";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import {
  getByUser,
  getMembers,
  getEvents,
  selectTeamById,
  selectMembers,
  selectEvents,
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
} from "@chakra-ui/react";

import { stringToJSDate } from "utils/misc";

export const Team = () => {
  const { team_id } = useParams();

  const user = useAppSelector(selectUser);
  const team = useAppSelector((state) =>
    selectTeamById(state, team_id ? parseInt(team_id) : undefined)
  );
  const members = useAppSelector(selectMembers);
  const events = useAppSelector(selectEvents);

  const dispatch = useAppDispatch();

  useEffect(() => {
    user.id && dispatch(getByUser(user.id)); // we are getting all teams to get a single team. should use seperate slice for single team store.
    team_id && dispatch(getMembers(parseInt(team_id)));
    team_id && dispatch(getEvents(parseInt(team_id)));
  }, []);

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
        <Flex maxW={"1000px"} w={"full"} gap={5}>
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
                  Team Members
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />
              <Stack align={"center"} my={5} gap={2}>
                {members.map((member) => (
                  <Text color={"gray.500"}>{member.username}</Text>
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
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={800} fontFamily={"body"}>
                  Schedule
                </Heading>
              </Stack>
              <Divider borderColor={"gray.300"} />{" "}
              <Flex direction="column" alignItems={"center"} my={5} gap={5}>
                {events.map((event) => (
                  <Box
                    height={"fit-content"}
                    w={"full"}
                    border={"1px"}
                    borderColor={"gray.300"}
                    rounded={"xl"}
                    overflow={"hidden"}
                    py={7}
                    px={5}
                  >
                    <Stack spacing={0} align={"center"}>
                      <Heading
                        fontSize={"lg"}
                        fontWeight={500}
                        fontFamily={"body"}
                      >
                        {event.name}
                      </Heading>
                      <Text color={"gray.500"}>
                        {stringToJSDate(event.startTime).toLocaleString()} -{" "}
                        {stringToJSDate(event.endTime).toLocaleString()}
                      </Text>
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
                        {event.eventType}
                      </Badge>
                    </Stack>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
