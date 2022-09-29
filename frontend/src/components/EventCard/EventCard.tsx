import { FC } from "react";
import { Heading, Box, Flex, Text, Stack, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { stringToJSDate } from "utils/misc";

interface IProps {
  event: {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    eventType: string;
    teamScore: number;
    opponentScore: number;
  };
}

export const EventCard: FC<IProps> = ({ event }) => {
  const navigate = useNavigate();

  const goToEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(`events/${event.id}`);
  };

  return (
    <Box
      height={"fit-content"}
      w={"full"}
      border={"1px"}
      borderColor={"gray.300"}
      rounded={"xl"}
      overflow={"hidden"}
      py={7}
      px={5}
      _hover={{ bg: "gray.50", cursor: "pointer" }}
      onClick={goToEvent}
    >
      <Stack spacing={0} align={"center"}>
        <Heading fontSize={"lg"} fontWeight={500} fontFamily={"body"}>
          {event.name}
        </Heading>
        <Text color={"gray.500"}>
          {stringToJSDate(event.startTime).toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {stringToJSDate(event.endTime).toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Stack>
      <Stack align={"center"} justify={"center"} direction={"row"} mt={5}>
        <Badge px={2} py={1} fontWeight={"700"} textTransform={"none"}>
          {event.eventType}
        </Badge>
      </Stack>
      {stringToJSDate(event.endTime) < new Date() && (
        <Stack
          justify={"space-evenly"}
          textAlign={"center"}
          direction={"row"}
          mt={7}
        >
          <Stack direction={"column"}>
            <Heading fontSize={"xx-large"}>{event.teamScore}</Heading>
            <Text>Team Score</Text>
          </Stack>
          <Stack direction={"column"}>
            <Heading fontSize={"xx-large"}>{event.opponentScore}</Heading>
            <Text>Opponent Score</Text>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
