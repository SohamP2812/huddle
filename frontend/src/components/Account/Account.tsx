import { useState } from "react";
import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { logout, selectUser } from "redux/slices/userSlice";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const toast = useToast();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [accountFields, setAccountFields] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleChangeSignupFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAccountFields({
      ...accountFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(logout());
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
            <Heading fontSize={"4xl"}>Account</Heading>
          </Stack>
          <form onSubmit={handleLogout}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  onChange={handleChangeSignupFields}
                  value={accountFields.username}
                />
              </FormControl>
              <FormControl id="firstName">
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  onChange={handleChangeSignupFields}
                  value={accountFields.firstName}
                />
              </FormControl>
              <FormControl id="lastName">
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  onChange={handleChangeSignupFields}
                  value={accountFields.lastName}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  disabled
                  type="text"
                  name="email"
                  onChange={handleChangeSignupFields}
                  value={accountFields.email}
                />
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
                Update
              </Button>
              <Button
                type="submit"
                bg={"transparent"}
                color={"black"}
                border={"1px"}
                borderColor={"black"}
                _hover={{
                  bg: "gray.200",
                }}
              >
                Logout
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </>
  );
};
