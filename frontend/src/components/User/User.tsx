import React from 'react';
import { Flex, Center, Spinner, Stack, Image, Text, Box } from '@chakra-ui/react';
import { useGetUserQuery } from 'redux/slices/apiSlice';
import { useParams } from 'react-router-dom';

export const User = () => {
  const { user_id } = useParams();

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(
    user_id ? parseInt(user_id) : 0,
    {
      skip: !user_id
    }
  );

  if (isUserLoading) {
    return (
      <Center height={'84vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <Flex
      flexDirection={'column'}
      minH={'100vh'}
      pt={10}
      px={10}
      bg={'gray.50'}
      alignItems={'center'}
    >
      <Flex py={12} flexDir={'column'} maxW={'700px'} w={'full'}>
        <Stack spacing={4} align={'center'}>
          <Image
            width={'150px'}
            height={'150px'}
            objectFit={'cover'}
            src={
              user?.profilePictureUrl ??
              'https://res.cloudinary.com/dorjnhwzp/image/upload/v1685321543/users/profile-pictures/default.jpg'
            }
            border={'1px'}
            borderColor={'gray.400'}
            background={'white'}
            rounded={'full'}
          />
        </Stack>
        <Stack mt={8}>
          <Text fontWeight={'semibold'}>Username:</Text>
          <Box border={'1px'} borderColor={'gray.300'} rounded={'xl'}>
            <Text
              p={2}
              scrollPaddingY={10}
              maxHeight={150}
              overflowY={'scroll'}
              whiteSpace={'pre-wrap'}
            >
              {user?.username}
            </Text>
          </Box>
        </Stack>
        <Stack mt={8}>
          <Text fontWeight={'semibold'}>First Name:</Text>
          <Box border={'1px'} borderColor={'gray.300'} rounded={'xl'}>
            <Text
              p={2}
              scrollPaddingY={10}
              maxHeight={150}
              overflowY={'scroll'}
              whiteSpace={'pre-wrap'}
            >
              {user?.firstName}
            </Text>
          </Box>
        </Stack>
        <Stack mt={8}>
          <Text fontWeight={'semibold'}>Last Name:</Text>
          <Box border={'1px'} borderColor={'gray.300'} rounded={'xl'}>
            <Text
              p={2}
              scrollPaddingY={10}
              maxHeight={150}
              overflowY={'scroll'}
              whiteSpace={'pre-wrap'}
            >
              {user?.lastName}
            </Text>
          </Box>
        </Stack>
      </Flex>
    </Flex>
  );
};
