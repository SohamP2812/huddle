import React, { useState, useEffect } from 'react';
import {
  useGetSelfQuery,
  useLoginMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation
} from 'redux/slices/apiSlice';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { allFieldsFilled, getErrorMessage } from 'utils/misc';

export const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect');

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
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/account');
      }
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    if (user) {
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/');
      }
    }
  }, [user]);

  const [loginFields, setLoginFields] = useState({
    username: '',
    password: ''
  });

  const [forgotPassword, setForgotPassword] = useState(false);

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

  const resetToken = () => {
    setSearchParams({});
  };

  if (isUserLoading) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  if (token) {
    return <NewPassword token={token} resetToken={resetToken} />;
  }

  if (forgotPassword) {
    return <ForgotPassword setForgotPassword={setForgotPassword} />;
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
                  <Link onClick={() => setForgotPassword(true)} color={'blue.400'}>
                    Forgot password?
                  </Link>

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
                <Link
                  as={RouterLink}
                  to={`/sign-up${redirect && `?redirect=${redirect}`}`}
                  color={'blue.400'}
                >
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

const ForgotPassword = ({
  setForgotPassword
}: {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toast = useToast();

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const [resetPassword, { error, isSuccess, isLoading }] = useResetPasswordMutation();

  const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword({ email: forgotPasswordEmail });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Reset email sent.',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(error),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [error]);

  return (
    <Flex minH={'100vh'} pt={{ base: 0, md: 20 }} justify={'center'} bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <form onSubmit={handleForgotPassword}>
            <Stack spacing={4}>
              <Link onClick={() => setForgotPassword(false)} color={'blue.400'}>
                Back
              </Link>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>Forgot your password?</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                You&apos;ll get an email with a reset link
              </Text>
              <FormControl id="username">
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  name="email"
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  value={forgotPasswordEmail}
                />
              </FormControl>
              <Button
                isLoading={isLoading}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
                disabled={!forgotPasswordEmail}
              >
                Request Reset
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

const NewPassword = ({ token, resetToken }: { token: string; resetToken: () => void }) => {
  const toast = useToast();

  const [password, setPassword] = useState('');

  const [updatePassword, { error, isSuccess, isLoading }] = useUpdatePasswordMutation();

  const setNewPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updatePassword({ token: token, password: password });
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Password reset successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      resetToken();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(error),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [error]);

  return (
    <Flex minH={'100vh'} pt={{ base: 0, md: 20 }} justify={'center'} bg={'gray.50'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <form onSubmit={setNewPassword}>
            <Stack spacing={4}>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>Reset your password</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                You&apos;ll be able to sign in with this new password
              </Text>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </FormControl>
              <Button
                isLoading={isLoading}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
                disabled={!password}
              >
                Reset
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};
