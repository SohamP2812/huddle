import { FC } from "react";
import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface IProps {
  name: string;
  sport: string;
  manager: string;
}

export const TeamCard: FC<IProps> = ({ name, sport, manager }) => {
  return (
    <>
      <Center py={6} w={"100%"}>
        <Stack
          borderWidth="1px"
          borderRadius="3xl"
          maxW={"540px"}
          w={"100%"}
          height={{ base: "15rem", md: "20rem" }}
          direction={{ base: "column", md: "row" }}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={4}
          _hover={{
            transform: "rotate(0deg) scale(1.025) translateY(3px)",
            transition: "0.25s all ease",
          }}
          transition={"0.19s all ease"}
          cursor={"pointer"}
        >
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Heading fontSize={"3xl"} fontFamily={"body"}>
              {name}
            </Heading>
            <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
              {sport}
            </Text>
            <Stack
              align={"center"}
              justify={"center"}
              direction={"row"}
              pt={15}
            >
              <Badge
                px={2}
                py={1}
                bg={useColorModeValue("gray.50", "gray.800")}
                fontWeight={"400"}
                textTransform={"none"}
              >
                Manager: <strong>{manager}</strong>
              </Badge>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </>
  );
};
