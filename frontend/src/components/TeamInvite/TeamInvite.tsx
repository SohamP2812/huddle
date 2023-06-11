import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Text,
  useToast,
  Center,
  Spinner,
  Heading,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react';
import {
  useUpdateInviteMutation,
  useGetInvitesQuery,
  useGetSelfQuery
} from 'redux/slices/apiSlice';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from 'utils/misc';
import { BackButton } from 'components/BackButton/BackButton';
import { useNavigate } from 'react-router-dom';

import { positions } from 'utils/consts';

export const TeamInvite = () => {
  const toast = useToast();

  const { invite_token } = useParams();
  const navigate = useNavigate();

  const { data: userResponse, isLoading: isUserLoading } = useGetSelfQuery();
  const email = userResponse?.email;
  const {
    data: invitesResponse,
    isLoading: isInvitesLoading,
    error: invitesError
  } = useGetInvitesQuery(email ?? '0', {
    skip: !email
  });
  const invites = invitesResponse?.invites ?? [];
  const invite = invite_token ? invites.find((invite) => invite.token === invite_token) : null;
  const [
    updateInvite,
    {
      data: updateInviteData,
      error: updateInviteError,
      isSuccess: isUpdateInviteSuccess,
      isLoading: isUpdateInviteLoading
    }
  ] = useUpdateInviteMutation();

  const [inviteFields, setInviteFields] = useState({
    position: 'UNKNOWN'
  });

  const handleChangeInviteFields = (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setInviteFields({
      ...inviteFields,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (invitesError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(invitesError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [invitesError]);

  useEffect(() => {
    if (isUpdateInviteSuccess) {
      let updateMessage = 'Updated invite successfully!';

      if (updateInviteData?.state === 'ACCEPTED') {
        updateMessage = 'Joined team successfully!';
      } else if (updateInviteData?.state === 'DECLINED') {
        updateMessage = 'Rejected invite successfully.';
      }

      toast({
        title: updateMessage,
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate('/invites');
    }
  }, [isUpdateInviteSuccess]);

  useEffect(() => {
    if (updateInviteError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(updateInviteError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [updateInviteError]);

  const handleAcceptInvite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (invite_token) {
      updateInvite({
        inviteToken: invite_token,
        position: inviteFields.position,
        state: 'ACCEPTED'
      });
    }
  };

  const handleDeclineInvite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (invite_token) {
      updateInvite({ inviteToken: invite_token, position: 'UNKNOWN', state: 'DECLINED' });
    }
  };

  if (isUserLoading || isInvitesLoading || !invite) {
    return (
      <Center height={'84vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
      <Stack
        spacing={8}
        mx={'auto'}
        width={{ base: 'xl', lg: '2xl' }}
        py={12}
        px={6}
        gap={1}
        direction={'column'}
      >
        <BackButton fallback={'/invites'} />
        <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
          <Box bg="blue.500" p={3} roundedTop="md">
            <Heading as="h2" size="md" color="white">
              Team Invitation
            </Heading>
          </Box>
          <Box bg="gray.100" roundedBottom="md" mb={5} p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {invite?.team?.name}
            </Text>
            <Text>
              Team Manager: <strong>{invite.team?.manager?.firstName}</strong>
            </Text>
          </Box>
          <FormControl id="position">
            <FormLabel>Position</FormLabel>
            <Select
              name="position"
              onChange={handleChangeInviteFields}
              value={inviteFields.position}
            >
              {Object.keys(positions[invite.team.sport as keyof typeof positions].nameToKey).map(
                (position) => (
                  <option
                    key={position}
                    value={
                      positions[invite.team.sport as keyof typeof positions].nameToKey[position]
                    }
                  >
                    {position}
                  </option>
                )
              )}
            </Select>
          </FormControl>
          {isUpdateInviteLoading ? (
            <Center pt={8}>
              <Spinner size={'lg'} />
            </Center>
          ) : (
            <Flex justifyContent="center" pt={8}>
              <Button colorScheme="green" mr={2} onClick={handleAcceptInvite}>
                Accept
              </Button>
              <Button colorScheme="red" mr={2} onClick={handleDeclineInvite}>
                Decline
              </Button>
            </Flex>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};
