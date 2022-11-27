import React, { useState, useEffect } from 'react';
import { useCreateTeamMutation } from 'redux/slices/apiSlice';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Spacer,
  Select,
  useToast
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

import { sports } from 'utils/consts';

import { BackButton } from 'components/BackButton/BackButton';
import { getErrorMessage } from 'utils/misc';

export const CreateTeam = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [
    createTeam,
    { isLoading: isCreationLoading, isSuccess: isCreationSuccess, error: creationError }
  ] = useCreateTeamMutation();

  useEffect(() => {
    if (isCreationSuccess) {
      toast({
        title: 'Created successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate(`/teams`);
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

  const [teamFields, setTeamFields] = useState({
    name: '',
    sport: 'BASKETBALL'
  });

  const handleChangeTeamFields = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setTeamFields({
      ...teamFields,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    createTeam(teamFields);
  };

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'xl'} py={12} px={6}>
          <BackButton fallback="/teams" />
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create a team</Heading>
          </Stack>
          <form onSubmit={handleCreateTeam}>
            <Stack spacing={4}>
              <FormControl id="name">
                <FormLabel>Team Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChangeTeamFields}
                  value={teamFields.name}
                />
              </FormControl>
              <FormControl id="sport">
                <FormLabel>Sport</FormLabel>
                <Select name="sport" onChange={handleChangeTeamFields} value={teamFields.sport}>
                  {Object.keys(sports.nameToKey).map((sport) => (
                    <option
                      key={sport}
                      value={sports.nameToKey[sport as keyof typeof sports.nameToKey]}
                    >
                      {sport}
                    </option>
                  ))}
                </Select>
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
