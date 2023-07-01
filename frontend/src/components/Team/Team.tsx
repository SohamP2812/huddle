import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  useGetMembersQuery,
  useGetSelfQuery,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useSearchUsersQuery,
  useGetEventsQuery,
  useCreateInviteMutation,
  useGetAlbumsQuery,
  useDeleteMemberMutation
} from 'redux/slices/apiSlice';
import {
  Spinner,
  Heading,
  Box,
  Flex,
  Text,
  Stack,
  Badge,
  Divider,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Button,
  Input,
  useToast,
  Center
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { getErrorMessage, stringToJSDate } from 'utils/misc';

import { EventCard } from 'components/EventCard/EventCard';
import { BackButton } from 'components/BackButton/BackButton';
import { AlbumCard } from 'components/AlbumCard/AlbumCard';
import { TeamMemberCard } from 'components/TeamMemberCard/TeamMemberCard';

export const Team = () => {
  const [usernameQuery, setUsernameQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [showPastEvents, setShowPastEvents] = useState(false);

  const toast = useToast();
  const {
    isOpen: isAddMemberChoiceOpen,
    onOpen: onAddMemberChoiceOpen,
    onClose: onAddMemberChoiceClose
  } = useDisclosure();
  const {
    isOpen: isMemberListOpen,
    onOpen: onMemberListOpen,
    onClose: onMemberListClose
  } = useDisclosure();
  const {
    isOpen: isEmailInviteOpen,
    onOpen: onEmailInviteOpen,
    onClose: onEmailInviteClose
  } = useDisclosure();

  const navigate = useNavigate();
  const { team_id } = useParams();

  const { data: user, isLoading: isUserLoading } = useGetSelfQuery();
  const userId = user?.id ?? 0;
  const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery(userId ?? 0, {
    skip: !userId
  });
  const teams = teamsResponse?.teams ?? [];
  const team = team_id ? teams.find((team) => team.id === parseInt(team_id)) : null;
  const { data: membersResponse, isLoading: isMembersLoading } = useGetMembersQuery(
    team_id ? parseInt(team_id) : 0,
    {
      skip: !team_id
    }
  );
  const members = membersResponse?.members ?? [];
  const { data: albumsResponse, isLoading: isAlbumsLoading } = useGetAlbumsQuery(
    team_id ? parseInt(team_id) : 0,
    {
      skip: !team_id
    }
  );
  const albums = albumsResponse?.albums ?? [];
  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEventsQuery(
    team_id ? parseInt(team_id) : 0,
    {
      skip: !team_id
    }
  );
  const events = eventsResponse?.events ?? [];
  const { data: searchUsersResponse, isLoading: isSearchUsersLoading } = useSearchUsersQuery(
    usernameQuery,
    { skip: !usernameQuery }
  );
  const searchUsers = usernameQuery ? searchUsersResponse?.users ?? [] : [];
  const [
    deleteTeam,
    { error: deleteTeamError, isSuccess: isDeleteTeamSuccess, isLoading: isDeleteTeamLoading }
  ] = useDeleteTeamMutation();
  const [
    createInvite,
    { error: createInviteError, isSuccess: isCreateInviteSuccess, isLoading: isCreateInviteLoading }
  ] = useCreateInviteMutation();
  const [
    deleteMember,
    { error: deleteMemberError, isSuccess: isDeleteMemberSuccess, isLoading: isDeleteMemberLoading }
  ] = useDeleteMemberMutation();

  useEffect(() => {
    if (isDeleteMemberSuccess) {
      navigate(`/teams`);
    }
  }, [isDeleteMemberSuccess]);

  useEffect(() => {
    if (deleteMemberError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(deleteMemberError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [deleteMemberError]);

  useEffect(() => {
    if (isCreateInviteSuccess) {
      toast({
        title: 'Sent invite successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      handleOnMemberListClose();
      handleOnEmailInviteClose();
    }
  }, [isCreateInviteSuccess]);

  useEffect(() => {
    if (createInviteError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(createInviteError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      handleOnMemberListClose();
      handleOnEmailInviteClose();
    }
  }, [createInviteError]);

  useEffect(() => {
    if (isDeleteTeamSuccess) {
      toast({
        title: 'Deleted team successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate(`/teams`);
    }
  }, [isDeleteTeamSuccess]);

  useEffect(() => {
    if (deleteTeamError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(deleteTeamError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [deleteTeamError]);

  const toggleShowPastEvents = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowPastEvents(!showPastEvents);
  };

  const handleCreateEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate('create-event');
  };

  const handleCreateAlbum = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate('create-album');
  };

  const handleUpdateUsernameQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameQuery(e.target.value);
  };

  const handleUpdateInviteEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
  };

  const handleOnMemberListClose = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    setUsernameQuery('');
    onMemberListClose();
  };

  const handleOnEmailInviteClose = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    setInviteEmail('');
    onEmailInviteClose();
  };

  const handleOnMemberListOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setUsernameQuery('');
    onAddMemberChoiceClose();
    onMemberListOpen();
  };

  const handleOnEmailInviteOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setInviteEmail('');
    onAddMemberChoiceClose();
    onEmailInviteOpen();
  };

  const handleDeleteMember = (
    e: React.MouseEvent<SVGElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number | null
  ) => {
    e.preventDefault();
    if (team_id && id && userId) {
      deleteMember({
        userId: id,
        teamId: parseInt(team_id)
      });
    }
  };

  const handleDeleteTeam = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (team_id) {
      deleteTeam(parseInt(team_id));
    }
  };

  const handleInvite = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    email: string
  ) => {
    e.preventDefault();
    if (team_id) {
      createInvite({ teamId: parseInt(team_id), email: email });
    }
  };

  if (isTeamsLoading || isUserLoading || !team_id || !team) {
    return (
      <Center height={'84vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'5xl'} py={12} px={6} gap={1} direction={'column'}>
          <BackButton fallback={'/teams'} />
          <Flex maxW={'1000px'} w={'full'}>
            <Box
              height={'fit-content'}
              w={'full'}
              bg={'white'}
              boxShadow={'2xl'}
              rounded={'xl'}
              overflow={'hidden'}
            >
              <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
                    {team.name}
                  </Heading>
                </Stack>
                <Divider borderColor={'gray.300'} />
                <Stack spacing={0} align={'center'} my={5}>
                  <Heading fontSize={'lg'} fontWeight={500} fontFamily={'body'}>
                    {team?.manager.firstName} {team?.manager.lastName}
                  </Heading>
                  <Button
                    as={RouterLink}
                    color={'gray.500'}
                    variant={'link'}
                    to={`/users/${team?.manager.id}`}
                  >
                    @{team?.manager.username}
                  </Button>
                </Stack>
                <Stack align={'center'} justify={'center'} direction={'row'}>
                  <Badge px={2} py={1} bg={'gray.100'} fontWeight={'700'} textTransform={'none'}>
                    Manager
                  </Badge>
                </Stack>
              </Box>
            </Box>
          </Flex>

          <Flex direction={{ base: 'column', md: 'row' }} maxW={'1000px'} w={'full'} gap={5}>
            <Box
              height={'fit-content'}
              w={'full'}
              bg={'white'}
              boxShadow={'2xl'}
              rounded={'xl'}
              overflow={'hidden'}
            >
              <Box p={6}>
                <Stack direction={'row'} justifyContent="right" color="blue.400" mb={'2'}>
                  {members.find((member) => member.id === userId)?.isManager && (
                    <Flex
                      gap={2}
                      alignItems={'center'}
                      _hover={{
                        cursor: 'pointer'
                      }}
                      onClick={onAddMemberChoiceOpen}
                    >
                      <AddIcon w={3} h={3} />
                      <Text>Add Member</Text>
                    </Flex>
                  )}
                </Stack>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
                    Team Members
                  </Heading>
                </Stack>
                <Divider borderColor={'gray.300'} />
                <Stack maxHeight={'482px'} overflowY={'auto'} my={5} gap={3}>
                  {isMembersLoading ? (
                    <Center height={40}>
                      <Spinner size={'xl'} />
                    </Center>
                  ) : (
                    members
                      .slice()
                      .sort((a, b) => {
                        if (a.id === userId) {
                          return -1;
                        } else if (b.id === userId) {
                          return 1;
                        } else {
                          return 0;
                        }
                      })
                      .map((member) => (
                        <TeamMemberCard
                          key={member.id}
                          member={member}
                          isManager={
                            members.find((member) => member.id === userId)?.isManager || false
                          }
                          userId={userId}
                          teamId={parseInt(team_id)}
                          sport={team?.sport}
                        />
                      ))
                  )}
                </Stack>
              </Box>
            </Box>
            <Box
              height={'fit-content'}
              w={'full'}
              bg={'white'}
              boxShadow={'2xl'}
              rounded={'xl'}
              overflow={'hidden'}
            >
              <Box p={6}>
                <Stack direction={'row'} justifyContent="right" color="blue.400" mb={'2'}>
                  {members.find((member) => member.id === userId)?.isManager && (
                    <Flex
                      gap={2}
                      alignItems={'center'}
                      _hover={{
                        cursor: 'pointer'
                      }}
                      onClick={handleCreateEvent}
                    >
                      <AddIcon w={3} h={3} />
                      <Text>Create Event</Text>
                    </Flex>
                  )}
                </Stack>
                <Stack spacing={0} align={'center'} mb={5} gap={2}>
                  <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
                    Schedule
                  </Heading>
                  <Checkbox isChecked={showPastEvents} onChange={toggleShowPastEvents}>
                    Show Past Events
                  </Checkbox>
                </Stack>
                <Divider borderColor={'gray.300'} />
                <Flex
                  maxHeight={'450px'}
                  overflowY={'auto'}
                  direction="column"
                  alignItems={'center'}
                  my={5}
                  gap={5}
                >
                  {isEventsLoading ? (
                    <Center height={40}>
                      <Spinner size={'xl'} />
                    </Center>
                  ) : (
                    events
                      .filter(
                        (event) => stringToJSDate(event.endTime) > new Date() || showPastEvents
                      )
                      .sort(
                        (a, b) =>
                          stringToJSDate(b.startTime).getTime() -
                          stringToJSDate(a.startTime).getTime()
                      )
                      .map((event) => <EventCard key={event.id} event={event} />)
                  )}
                </Flex>
              </Box>
            </Box>
          </Flex>

          <Flex direction={{ base: 'column', md: 'row' }} maxW={'1000px'} w={'full'} gap={5}>
            <Box
              height={'fit-content'}
              w={'full'}
              bg={'white'}
              boxShadow={'2xl'}
              rounded={'xl'}
              overflow={'hidden'}
            >
              <Box p={6}>
                <Stack direction={'row'} justifyContent="right" color="blue.400" mb={'2'}>
                  {members.find((member) => member.id === userId)?.isManager && (
                    <Flex
                      gap={2}
                      alignItems={'center'}
                      _hover={{
                        cursor: 'pointer'
                      }}
                      onClick={handleCreateAlbum}
                    >
                      <AddIcon w={3} h={3} />
                      <Text>Create Album</Text>
                    </Flex>
                  )}
                </Stack>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading fontSize={'2xl'} fontWeight={800} fontFamily={'body'}>
                    Albums
                  </Heading>
                </Stack>
                <Divider borderColor={'gray.300'} />
                <Stack my={5} gap={2}>
                  {isAlbumsLoading ? (
                    <Center height={40}>
                      <Spinner size={'xl'} />
                    </Center>
                  ) : (
                    [...albums]
                      .sort(
                        (a, b) =>
                          stringToJSDate(b.createdAt).getTime() -
                          stringToJSDate(a.createdAt).getTime()
                      )
                      .map((album) => (
                        <Stack
                          justify={'space-between'}
                          align="center"
                          direction="row"
                          key={album.id}
                        >
                          <AlbumCard album={album} />
                        </Stack>
                      ))
                  )}
                </Stack>
              </Box>
            </Box>
          </Flex>

          {members.find((member) => member.id === userId)?.isManager ? (
            <Button
              isLoading={isDeleteTeamLoading}
              mb={5}
              p={4}
              py={6}
              bg="red"
              color="white"
              _hover={{ bg: 'red.400' }}
              onClick={handleDeleteTeam}
              width={'fit-content'}
              alignSelf="center"
            >
              Delete Team
            </Button>
          ) : (
            <Button
              mb={5}
              p={4}
              py={6}
              bg="red"
              color="white"
              _hover={{ bg: 'red.400' }}
              onClick={(e) => {
                handleDeleteMember(e, userId);
              }}
              width={'fit-content'}
              alignSelf="center"
              isLoading={isDeleteMemberLoading}
            >
              Leave Team
            </Button>
          )}

          <Modal isOpen={isAddMemberChoiceOpen} onClose={onAddMemberChoiceClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select one</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack my={5} gap={2}>
                  <Button
                    w={'fit'}
                    py={8}
                    px={10}
                    bg={'#151f21'}
                    color={'white'}
                    rounded={'lg'}
                    gap={'10px'}
                    _hover={{
                      opacity: '60%'
                    }}
                    onClick={handleOnMemberListOpen}
                  >
                    Search by username
                  </Button>{' '}
                  <Button
                    w={'fit'}
                    py={8}
                    px={10}
                    bg={'#151f21'}
                    color={'white'}
                    rounded={'lg'}
                    gap={'10px'}
                    _hover={{
                      opacity: '60%'
                    }}
                    onClick={handleOnEmailInviteOpen}
                  >
                    Send email invite
                  </Button>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onAddMemberChoiceClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isMemberListOpen} onClose={handleOnMemberListClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update Member List</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={10} id="participantIds">
                  <FormLabel mb={0}>Username</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onChange={handleUpdateUsernameQuery}
                    value={usernameQuery}
                  />
                </FormControl>
                <Stack
                  height={'fit-content'}
                  h={'170px'}
                  w={'full'}
                  border={'1px'}
                  borderColor={'gray.300'}
                  rounded={'xl'}
                  overflow={'scroll'}
                  px={5}
                  py={2}
                >
                  {isSearchUsersLoading || isCreateInviteLoading ? (
                    <Center height={'full'}>
                      <Spinner size={'lg'} />
                    </Center>
                  ) : (
                    searchUsers
                      .filter(
                        (searchUser) =>
                          searchUser.id !== userId &&
                          !members.some((members) => members.id === searchUser.id)
                      )
                      .map((searchUser) => (
                        <Box
                          p={2}
                          _hover={{ cursor: 'pointer', bg: 'gray.50' }}
                          onClick={(e) => handleInvite(e, searchUser.email)}
                          key={searchUser.id}
                        >
                          <Text key={searchUser.id}>{searchUser.username}</Text>
                          <Divider borderColor={'gray.300'} />
                        </Box>
                      ))
                  )}
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleOnMemberListClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isEmailInviteOpen} onClose={handleOnEmailInviteClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Send an email invite</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={10} id="participantIds">
                  <FormLabel mb={0}>Email</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onChange={handleUpdateInviteEmail}
                    value={inviteEmail}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleOnEmailInviteClose}>
                  Close
                </Button>
                <Button
                  disabled={!inviteEmail}
                  isLoading={isCreateInviteLoading}
                  colorScheme="blue"
                  onClick={(e) => handleInvite(e, inviteEmail)}
                >
                  Send
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </>
  );
};
