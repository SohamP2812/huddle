import React, { useEffect, useState } from 'react';
import { useToast, Center, Spinner, Flex, Stack, Heading, Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useGetSelfQuery, useGetInvitesQuery } from 'redux/slices/apiSlice';
import { getErrorMessage, stringToJSDate } from 'utils/misc';
import { TeamInviteCard } from 'components/TeamInviteCard/TeamInviteCard';

export const TeamInvites = () => {
  const toast = useToast();

  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [refreshDisabled, setRefreshDisabled] = useState(false);

  const { data: userResponse, isLoading: isUserLoading } = useGetSelfQuery();
  const email = userResponse?.email;
  const {
    data: invitesResponse,
    isLoading: isInvitesLoading,
    error: invitesError,
    refetch
  } = useGetInvitesQuery(email ?? '0', {
    skip: !email
  });
  const invites = invitesResponse?.invites ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() > lastRefresh + 6000 && refreshDisabled) {
        setRefreshDisabled(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRefresh]);

  const handleRefetchInvites = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    refetch();
    setRefreshDisabled(true);
    setLastRefresh(Date.now());
    toast({
      title: 'Refreshed invites.',
      status: 'success',
      position: 'top',
      duration: 2000,
      isClosable: true
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
        <Stack gap={5} flexDirection={'row'} spacing={0} align={'center'} mt={10}>
          <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
            You have no invites.
          </Heading>
          <Button
            disabled={refreshDisabled}
            rounded={'lg'}
            _hover={{
              opacity: '60%'
            }}
            onClick={handleRefetchInvites}
          >
            <RepeatIcon
              transition={'all 0.5s ease'}
              style={{ transform: refreshDisabled ? 'rotate(180deg)' : 'none' }}
              w={3}
              h={3}
            />
          </Button>
        </Stack>
      ) : (
        <>
          <Button
            disabled={refreshDisabled}
            rounded={'lg'}
            _hover={{
              opacity: '60%'
            }}
            onClick={handleRefetchInvites}
          >
            <RepeatIcon w={3} h={3} />
          </Button>
          {[...invites]
            .sort(
              (a, b) =>
                stringToJSDate(b.createdAt).getTime() - stringToJSDate(a.createdAt).getTime()
            )
            .map((invite) => (
              <TeamInviteCard
                key={invite.token}
                token={invite.token}
                teamName={invite.team.name}
                managerUsername={invite.team.manager.username}
              />
            ))}
        </>
      )}
    </Flex>
  );
};
