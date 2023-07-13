import React, { useEffect, useState } from 'react';
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
  Spacer,
  Center,
  Spinner,
  useToast,
  InputRightElement,
  InputGroup
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { allFieldsFilled, getErrorMessage } from 'utils/misc';

import { useGetSelfQuery, useCreateUserMutation } from 'redux/slices/apiSlice';

export const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect');

  const { data: user, isLoading: isUserLoading } = useGetSelfQuery();

  const [
    createUser,
    { error: creationError, isSuccess: isCreationSuccess, isLoading: isCreationLoading }
  ] = useCreateUserMutation();

  useEffect(() => {
    if (isCreationSuccess) {
      toast.closeAll();
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/account');
      }
    }
  }, [isCreationSuccess]);

  useEffect(() => {
    if (user) {
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/');
      }
    }
  }, [user]);

  useEffect(() => {
    if (creationError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(creationError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [creationError]);

  const [signupFields, setSignupFields] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeSignupFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSignupFields({
      ...signupFields,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser(signupFields);
  };

  if (isUserLoading) {
    return (
      <Center height={'84vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex minH={'100vh'} pt={{ base: 0, md: 5 }} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} minW={{ md: 'lg' }} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Create your account</Heading>
          </Stack>
          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <form onSubmit={handleSignup}>
              <Stack spacing={4}>
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
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      onChange={handleChangeSignupFields}
                      value={signupFields.password}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        _hover={{ bg: 'gray.100' }}
                        color={'black'}
                        variant={'ghost'}
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Spacer />
                <Button
                  isLoading={isCreationLoading}
                  type="submit"
                  bg={'black'}
                  color={'white'}
                  _hover={{
                    bg: 'gray.600'
                  }}
                  disabled={!allFieldsFilled(signupFields)}
                >
                  Sign Up
                </Button>
                <Link
                  as={RouterLink}
                  to={`/sign-in${redirect ? `?redirect=${redirect}` : ''}`}
                  color={'blue.400'}
                >
                  Already have an account? Login.
                </Link>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
