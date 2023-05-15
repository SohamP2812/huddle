import React, { useEffect, useState } from 'react';
import {
  useUpdateUserMutation,
  useGetSelfQuery,
  useLogoutMutation,
  useDeleteUserMutation
} from 'redux/slices/apiSlice';
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage, isObjectDiff } from 'utils/misc';

export const Account = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: userResponse, isLoading: isUserLoading } = useGetSelfQuery();
  const [
    updateUser,
    { error: updateError, isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    { error: deleteError, isSuccess: isDeleteSuccess, isLoading: isDeleteLoading }
  ] = useDeleteUserMutation();
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
    if (isDeleteSuccess) {
      navigate('/');
    }
  }, [isDeleteSuccess]);

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
    if (deleteError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(deleteError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [deleteError]);

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
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  };

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

    userResponse?.id &&
      updateUser({
        id: userResponse.id,
        updatedUser: { firstName: accountFields.firstName, lastName: accountFields.lastName }
      });
  };

  const handleDeleteAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    deleteUser({ id: accountFields.id, password: confirmPassword });
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
              <Spacer h={'xl'} />
              <Button
                onClick={onOpen}
                bg={'red'}
                color={'white'}
                border={'1px'}
                borderColor={'red.500'}
                _hover={{
                  bg: 'red.300'
                }}
              >
                Delete Account
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {`Deleting your account is an irreversable action. Please be certain you want to do this
            as you won't be able to recover your account.`}
            <Spacer h={'4'} />
            <FormLabel>Confirm your password</FormLabel>
            <Input
              name="password"
              type="password"
              onChange={handleChangeConfirmPassword}
              value={confirmPassword}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              disabled={!confirmPassword}
              isLoading={isDeleteLoading}
              colorScheme="red"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
