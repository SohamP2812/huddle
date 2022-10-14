import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import { getByUser, selectTeams } from "redux/slices/teamsSlice";
import { useEffect } from "react";
import {
  Flex,
  useColorModeValue,
  Button,
  Text,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

import { useIsMounted } from "hooks/useIsMounted";
import { sports } from "utils/consts";

import { TeamCard } from "components/TeamCard/TeamCard";
import { stringToJSDate } from "utils/misc";

export const Teams = () => {
  const isMounted = useIsMounted();

  const toast = useToast();

  const teams = useAppSelector(selectTeams);
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

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
    user.user.id && dispatch(getByUser(user.user.id));
  }, []);

  return (
    <>
      <Header />
      <Flex
        flexDirection={"column"}
        minH={"100vh"}
        pt={10}
        px={10}
        bg={useColorModeValue("gray.50", "gray.800")}
        alignItems={"center"}
      >
        <Button
          as={RouterLink}
          to={"/create-team"}
          w={"fit"}
          py={8}
          px={10}
          bg={useColorModeValue("#151f21", "gray.900")}
          color={"white"}
          rounded={"lg"}
          gap={"10px"}
          _hover={{
            opacity: "60%",
          }}
        >
          <AddIcon w={3} h={3} /> <Text>Create A Team</Text>
        </Button>
        <Spacer py={5} flex={0} />
        {[...teams.teams]
          .sort(
            (a, b) =>
              stringToJSDate(b.createdAt).getTime() -
              stringToJSDate(a.createdAt).getTime()
          )
          .map((team) => (
            <TeamCard
              key={team.name}
              id={team.id}
              name={team.name}
              sport={
                sports.keyToName[team.sport as keyof typeof sports.keyToName]
              }
              manager={team.manager.username}
            />
          ))}
      </Flex>
    </>
  );
};
