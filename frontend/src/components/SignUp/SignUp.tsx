import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { createAccount, selectUser } from "redux/slices/userSlice";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { allFieldsFilled } from "utils/misc";

import { Header } from "components/Header/Header";

export const SignUp = () => {
  const navigate = useNavigate();

  const toast = useToast();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.loggedIn) navigate("/");
  }, [user.loggedIn]);

  useEffect(() => {
    if (user.error) {
      toast({
        title: "An error occurred!",
        description: user.error,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [user.error]);

  const [signupFields, setSignupFields] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChangeSignupFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSignupFields({
      ...signupFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(createAccount(signupFields));
  };

  return (
    <>
      <Header />
      <Flex
        minH={"100vh"}
        pt={20}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to make your life a little bit easier ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <form onSubmit={handleSignup}>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    onChange={handleChangeSignupFields}
                    value={signupFields.username}
                  />
                </FormControl>
                <FormControl id="firstName">
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    onChange={handleChangeSignupFields}
                    value={signupFields.firstName}
                  />
                </FormControl>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    onChange={handleChangeSignupFields}
                    value={signupFields.lastName}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="text"
                    name="email"
                    onChange={handleChangeSignupFields}
                    value={signupFields.email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    onChange={handleChangeSignupFields}
                    value={signupFields.password}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Link color={"blue.400"}>Forgot password?</Link>

                  <Button
                    type="submit"
                    bg={"black"}
                    color={"white"}
                    _hover={{
                      bg: "gray.600",
                    }}
                    disabled={!allFieldsFilled(signupFields)}
                  >
                    Sign Up
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
