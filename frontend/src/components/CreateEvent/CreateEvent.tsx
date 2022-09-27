import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { createEvent, selectTeams } from "redux/slices/teamsSlice";
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

  const dispatch = useAppDispatch();

  const [eventFields, setEventFields] = useState({
    name: "",
    startTime: toIsoString(new Date()),
    endTime: toIsoString(new Date()),
    eventType: "GAME",
    teamScore: 0,
    opponentScore: 0,
    participantIds: [],
  });

  useEffect(() => {
    console.log(toIsoString(new Date()));
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
