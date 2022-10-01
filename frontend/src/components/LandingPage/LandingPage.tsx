import "@fontsource/plus-jakarta-sans/700.css";

import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import { selectUser } from "redux/slices/userSlice";
import {
  Text,
  Heading,
  Stack,
  useColorModeValue,
  Flex,
  Image,
  Button,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Header } from "components/Header/Header";
export const LandingPage: FC<{}> = () => {
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  return (
    <>
      <Header />
      <Flex
        minH={"100vh"}
        pt={{ base: 0, md: 5 }}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          w="100%"
          backgroundRepeat={"no-repeat"}
          objectFit={"cover"}
          bgImage={{ base: 'url("/images/NBACourtDark.jpeg")', md: "" }}
          brightness={0.1}
        >
          <Stack
            alignItems={"center"}
            p={10}
            mx={"auto"}
            w={"100%"}
            maxW={"1200px"}
          >
            <Stack gap={60} alignItems={"center"} direction={"row"}>
              <Flex direction="column" gap={8}>
                <Flex direction="column">
                  <Heading
                    color={{ base: "blue.400", md: "blue.500" }}
                    fontSize={50}
                    fontFamily={"Plus Jakarta Sans"}
                    fontWeight={"extrabold"}
                  >
                    Take control
                  </Heading>
                  <Heading
                    fontSize={50}
                    fontFamily={"Plus Jakarta Sans"}
                    color={{ base: "white", md: "black" }}
                    fontWeight={"extrabold"}
                  >
                    with better team management
                  </Heading>
                </Flex>
                <Text fontSize={16} color={{ base: "white", md: "black" }}>
                  Huddle offers a robust team management solution to ease
                  painpoints and return the focus to good team performance.
                </Text>
                <Button
                  border={"1px"}
                  borderColor={"gray.300"}
                  bg={{ base: "white", md: "gray.300" }}
                  py={6}
                  alignItems={"center"}
                  _hover={{
                    base: { background: "gray.300" },
                    md: { background: "gray.100" },
                  }}
                  onClick={() =>
                    navigate(user.loggedIn ? `/teams` : `/sign-up`)
                  }
                >
                  Get Started <ChevronRightIcon w={5} h={5} />
                </Button>
              </Flex>
              <Image
                maxWidth={"500px"}
                height={"700px"}
                rounded={"2xl"}
                objectFit={"cover"}
                src={"/images/NBACourt.jpeg"}
                display={{ base: "none", md: "block" }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};
