import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { createTeam, selectTeam } from "redux/slices/teamSlice";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Spacer,
  Select,
} from "@chakra-ui/react";

import { sports } from "utils/consts";

export const CreateTeam = () => {
  const toast = useToast();

  const team = useAppSelector(selectTeam);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (team.error) {
      toast({
        title: "An error occurred!",
        description: team.error,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [team.error]);

  const [teamFields, setTeamFields] = useState({
    name: team.name,
    sport: team.sport,
  });

  const handleChangeTeamFields = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setTeamFields({
      ...teamFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(createTeam(teamFields));
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
            <Heading fontSize={"4xl"}>Create a team</Heading>
          </Stack>
          <form onSubmit={handleCreateTeam}>
            <Stack spacing={4}>
              <FormControl id="name">
                <FormLabel>Team Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeTeamFields}
                  value={teamFields.name}
                />
              </FormControl>
              <FormControl id="sport">
                <FormLabel>Sport</FormLabel>
                <Select
                  name="sport"
                  onChange={handleChangeTeamFields}
                  defaultValue={"BASKETBALL"}
                >
                  {Object.keys(sports).map((sport) => (
                    <option value={sports[sport as keyof typeof sports]}>
                      {sport}
                    </option>
                  ))}
                </Select>
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
