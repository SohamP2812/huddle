import React, { useState, useEffect } from 'react';
import { useGetSelfQuery, useLoginMutation } from 'redux/slices/apiSlice';
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
  useToast,
  Center,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { allFieldsFilled, getErrorMessage } from 'utils/misc';

export const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: user, isLoading: isUserLoading } = useGetSelfQuery();

  const [login, { error: loginError, isSuccess: isLoginSuccess, isLoading: isLoginLoading }] =
    useLoginMutation();

  useEffect(() => {
    if (loginError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(loginError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [loginError]);

  useEffect(() => {
    if (isLoginSuccess) {
      navigate('/account');
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const [loginFields, setLoginFields] = useState({
    username: '',
    password: ''
  });

  const handleChangeLoginFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLoginFields({
      ...loginFields,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginFields);
  };

  if (isUserLoading) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex minH={'100vh'} pt={{ base: 0, md: 20 }} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to make your life a little bit easier ✌️
            </Text>
          </Stack>
          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <form onSubmit={handleLogin}>
              <Stack spacing={4}>
                <FormControl id="username">
                  <FormLabel>Username or Email</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    onChange={handleChangeLoginFields}
                    value={loginFields.username}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    onChange={handleChangeLoginFields}
                    value={loginFields.password}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Link color={'blue.400'}>Forgot password?</Link>

                  <Button
                    isLoading={isLoginLoading}
                    type="submit"
                    bg={'black'}
                    color={'white'}
                    _hover={{
                      bg: 'gray.600'
                    }}
                    disabled={!allFieldsFilled(loginFields)}
                  >
                    Sign in
                  </Button>
                </Stack>
                <Link as={RouterLink} to="/sign-up" color={'blue.400'}>
                  Don&apos;t have an account? Sign up.
                </Link>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
};
