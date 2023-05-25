import React, { useEffect } from 'react';
import {
  Button,
  Box,
  Text,
  useToast,
  Center,
  Spinner,
  Heading,
  Flex,
  Stack
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
    { error: updateInviteError, isSuccess: isUpdateInviteSuccess, isLoading: isUpdateInviteLoading }
  ] = useUpdateInviteMutation();

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
      toast({
        title: 'Joined team successfully!',
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
      updateInvite({ inviteToken: invite_token, accepted: true });
    }
  };

  if (isUserLoading || isInvitesLoading) {
    return (
      <Center height={'75vh'}>
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
          <Box bg="gray.100" roundedBottom="md" p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {invite?.team?.name}
            </Text>
            <Text>
              Team Manager: <strong>{invite?.team?.manager?.firstName}</strong>
            </Text>
          </Box>
          <Flex justifyContent="center" pt={8}>
            <Button
              isLoading={isUpdateInviteLoading}
              colorScheme="green"
              mr={2}
              onClick={handleAcceptInvite}
            >
              Accept
            </Button>
          </Flex>
        </Box>
      </Stack>
    </Flex>
  );
};
