import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import { getByUser, selectTeams } from "redux/slices/teamsSlice";
import { useEffect } from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";

import { sports } from "utils/consts";

import { TeamCard } from "components/TeamCard/TeamCard";

export const Teams = () => {
  const teams = useAppSelector(selectTeams);
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    user.id && dispatch(getByUser(user.id));
  }, []);

  return (
    <>
      <Header />
      <Flex
        flexDirection={"column"}
        minH={"100vh"}
        pt={10}
        px={10}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        {teams.teams.map((team) => (
          <TeamCard
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
