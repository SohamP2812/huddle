import React, { useState, useEffect } from 'react';
import { useCreateAlbumMutation } from 'redux/slices/apiSlice';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Spacer,
  useToast
} from '@chakra-ui/react';

import { useNavigate, useParams } from 'react-router-dom';

import { BackButton } from 'components/BackButton/BackButton';
import { getErrorMessage } from 'utils/misc';

export const CreateAlbum = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { team_id } = useParams();

  const [
    createAlbum,
    { isLoading: isCreationLoading, isSuccess: isCreationSuccess, error: creationError }
  ] = useCreateAlbumMutation();

  useEffect(() => {
    if (isCreationSuccess) {
      toast({
        title: 'Created successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate(`/teams/${team_id}`);
    }
  }, [isCreationSuccess]);

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

  const [albumFields, setAlbumFields] = useState({
    name: ''
  });

  const handleChangeAlbumFields = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setAlbumFields({
      ...albumFields,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAlbum = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (team_id) {
      createAlbum({ teamId: parseInt(team_id), createdAlbum: albumFields });
    }
  };

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'xl'} py={12} px={6}>
          <BackButton fallback="/teams" />
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create an album</Heading>
          </Stack>
          <form onSubmit={handleCreateAlbum}>
            <Stack spacing={4}>
              <FormControl id="name">
                <FormLabel>Album Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeAlbumFields}
                  value={albumFields.name}
                />
              </FormControl>
              <Spacer h={'xl'} />
              <Button
                isLoading={isCreationLoading}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </>
  );
};
