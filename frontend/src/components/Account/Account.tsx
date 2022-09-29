import { useState, useEffect } from "react";
import { Header } from "components/Header/Header";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { logout, updateUser, selectUser } from "redux/slices/userSlice";
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

import { useIsMounted } from "hooks/useIsMounted";
import { isObjectDiff } from "utils/misc";

export const Account = () => {
  const isMounted = useIsMounted();

  const toast = useToast();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.message && isMounted) {
      toast({
        title: user.message,
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [user.message]);

  useEffect(() => {
    if (user.error && isMounted) {
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

  const [accountFields, setAccountFields] = useState({
    username: user.user.username,
    firstName: user.user.firstName,
    lastName: user.user.lastName,
    email: user.user.email,
  });

  const handleChangeSignupFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAccountFields({
      ...accountFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    dispatch(logout());
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const { email, username, ...fieldsToUpdate } = accountFields;

    dispatch(updateUser(fieldsToUpdate));
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
          <form onSubmit={handleUpdateUser}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  disabled
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
                disabled={!isObjectDiff(accountFields, user)}
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
                onClick={handleLogout}
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
