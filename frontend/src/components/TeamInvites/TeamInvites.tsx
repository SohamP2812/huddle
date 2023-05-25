import React, { useEffect } from 'react';
import { useToast, Center, Spinner, Flex, Stack, Heading } from '@chakra-ui/react';
import { useGetSelfQuery, useGetInvitesQuery } from 'redux/slices/apiSlice';
import { getErrorMessage, stringToJSDate } from 'utils/misc';
import { TeamInviteCard } from 'components/TeamInviteCard/TeamInviteCard';

export const TeamInvites = () => {
  const toast = useToast();

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

  if (isUserLoading || isInvitesLoading) {
    return (
      <Center height={'75vh'}>
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
      {!invites.length ? (
        <Stack spacing={0} align={'center'} mt={10}>
          <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
            You have no invites.
          </Heading>
        </Stack>
      ) : null}
      {[...invites]
        .sort(
          (a, b) => stringToJSDate(b.createdAt).getTime() - stringToJSDate(a.createdAt).getTime()
        )
        .map((invite) => (
          <TeamInviteCard
            key={invite.token}
            token={invite.token}
            teamName={invite.team.name}
            managerUsername={invite.team.manager.username}
          />
        ))}
    </Flex>
  );
};
