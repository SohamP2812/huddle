import React, { useEffect, useState } from 'react';
import { useUpdateUserMutation, useGetSelfQuery, useLogoutMutation } from 'redux/slices/apiSlice';
import { User } from 'utils/types';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Spacer,
  Center,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage, isObjectDiff } from 'utils/misc';

export const Account = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: userResponse, isLoading: isUserLoading } = useGetSelfQuery();
  const [
    updateUser,
    { error: updateError, isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }
  ] = useUpdateUserMutation();
  const [logout, { error: logoutError, isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();

  // Is this necessary?
  useEffect(() => {
    setAccountFields({
      id: userResponse?.id ?? 0,
      username: userResponse?.username ?? '',
      firstName: userResponse?.firstName ?? '',
      lastName: userResponse?.lastName ?? '',
      email: userResponse?.email ?? '',
      createdAt: userResponse?.createdAt ?? Date.now().toString()
    });
  }, [userResponse]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast({
        title: 'Updated successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (updateError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(updateError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [updateError]);

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate('/');
    }
  }, [isLogoutSuccess]);

  useEffect(() => {
    if (logoutError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(logoutError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [logoutError]);

  const [accountFields, setAccountFields] = useState<User>({
    id: userResponse?.id ?? 0,
    username: userResponse?.username ?? '',
    firstName: userResponse?.firstName ?? '',
    lastName: userResponse?.lastName ?? '',
    email: userResponse?.email ?? '',
    createdAt: userResponse?.createdAt ?? Date.now().toString()
  });

  const handleChangeSignupFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAccountFields({
      ...accountFields,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    logout();
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    userResponse?.id && updateUser(accountFields);
  };

  // Need to check if !userResponse since it can be not loading but be null since we come from login
  if (isUserLoading || !userResponse) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'xl'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Account</Heading>
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
              <Spacer h={'xl'} />
              <Button
                isLoading={isUpdateLoading}
                disabled={!isObjectDiff(accountFields, userResponse)}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
              >
                Update
              </Button>
              <Button
                isLoading={isLogoutLoading}
                onClick={handleLogout}
                bg={'transparent'}
                color={'black'}
                border={'1px'}
                borderColor={'black'}
                _hover={{
                  bg: 'gray.200'
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
