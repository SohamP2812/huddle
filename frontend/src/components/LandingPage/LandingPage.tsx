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
        pt={10}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
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
                  color="blue.500"
                  fontSize={60}
                  fontFamily={"Plus Jakarta Sans"}
                >
                  Take control
                </Heading>
                <Heading fontSize={60} fontFamily={"Plus Jakarta Sans"}>
                  with better team management
                </Heading>
              </Flex>
              <Text fontSize={20}>
                Huddle offers a robust team management software to ease
                painpoints and return the focus to good team performance.
              </Text>
              <Button
                border={"1px"}
                borderColor={"gray.300"}
                bg={"gray.300"}
                py={6}
                alignItems={"center"}
                _hover={{ background: "gray.100" }}
                onClick={() => navigate(user.loggedIn ? `/teams` : `/sign-up`)}
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
            />
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};
