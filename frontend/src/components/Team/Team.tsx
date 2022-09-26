import { Header } from "components/Header/Header";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import {
  getByUser,
  selectTeamById,
  selectTeams,
} from "redux/slices/teamsSlice";
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Badge,
  Divider,
} from "@chakra-ui/react";

export const Team = () => {
  const { team_id } = useParams();

  const user = useAppSelector(selectUser);
  const team = useAppSelector((state) =>
    selectTeamById(state, team_id ? parseInt(team_id) : undefined)
  );
  const teams = useAppSelector(selectTeams);

  const dispatch = useAppDispatch();

  useEffect(() => {
    user.id && dispatch(getByUser(user.id)); // we are getting all teams to get a single team. should use seperate slice for single team store.
  }, []);

  return (
    <>
      <Header />
      <Flex
        justify={"center"}
        minH={"100vh"}
        bg={useColorModeValue("gray.50", "gray.800")}
        py={6}
        px={10}
      >
        <Box
          maxW={"1000px"}
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
    </>
  );
};
