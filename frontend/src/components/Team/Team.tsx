import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetMembersQuery,
  useGetSelfQuery,
  useGetTeamsQuery,
  useDeleteTeamMutation,
  useSearchUsersQuery,
  useDeleteMemberMutation,
  useGetEventsQuery,
  useAddMemberMutation
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
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

import { getErrorMessage, stringToJSDate } from 'utils/misc';

import { EventCard } from 'components/EventCard/EventCard';
import { BackButton } from 'components/BackButton/BackButton';

export const Team = () => {
  const [usernameQuery, setUsernameQuery] = useState('');

  const [showPastEvents, setShowPastEvents] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    addMember,
    { error: addMemberError, isSuccess: isAddMemberSuccess, isLoading: isAddMemberLoading }
  ] = useAddMemberMutation();
  const [
    deleteMember,
    { error: deleteMemberError, isSuccess: isDeleteMemberSuccess, isLoading: isDeleteMemberLoading }
  ] = useDeleteMemberMutation();
  const [
    deleteTeam,
    { error: deleteTeamError, isSuccess: isDeleteTeamSuccess, isLoading: isDeleteTeamLoading }
  ] = useDeleteTeamMutation();

  useEffect(() => {
    if (isAddMemberSuccess) {
      toast({
        title: 'Added member successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      onClose();
      setUsernameQuery('');
    }
  }, [isAddMemberSuccess]);

  useEffect(() => {
    if (addMemberError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(addMemberError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      onClose();
      setUsernameQuery('');
    }
  }, [addMemberError]);

  useEffect(() => {
    if (isDeleteMemberSuccess) {
      if (members.find((member) => member.id === userId)?.isManager) {
        toast({
          title: 'Member removed successfully.',
          status: 'success',
          position: 'top',
          duration: 5000,
          isClosable: true
        });
      } else {
        navigate(`/teams`);
      }
      onClose();
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
      onClose();
    }
  }, [deleteMemberError]);

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

  const handleUpdateUsernameQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameQuery(e.target.value);
  };

  const handleOnClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setUsernameQuery('');
    onClose();
  };

  const handleAddMember = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number | null) => {
    e.preventDefault();
    if (team_id && id) {
      addMember({
        teamId: parseInt(team_id),
        addedUserId: id
      });
    }
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

  if (isEventsLoading || isTeamsLoading || isUserLoading || isMembersLoading) {
    return (
      <Center height={'75vh'}>
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
                    {team?.name}
                  </Heading>
                </Stack>
                <Divider borderColor={'gray.300'} />
                <Stack spacing={0} align={'center'} my={5}>
                  <Heading fontSize={'lg'} fontWeight={500} fontFamily={'body'}>
                    {team?.manager.firstName} {team?.manager.lastName}
                  </Heading>
                  <Text color={'gray.500'}>{team?.manager.username}</Text>
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
                      onClick={onOpen}
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
                <Stack my={5} gap={2}>
                  {members
                    .filter((member) => member.id !== userId)
                    .map((member) => (
                      <Stack
                        justify={'space-between'}
                        align="center"
                        direction="row"
                        key={member.id}
                      >
                        <Text key={member.id} fontWeight={300} color={'gray.600'}>
                          {member.username}
                        </Text>
                        {member.id !== userId &&
                          members.find((member) => member.id === userId)?.isManager &&
                          (isDeleteMemberLoading ? (
                            <Center>
                              <Spinner />
                            </Center>
                          ) : (
                            <DeleteIcon
                              onClick={(e) => {
                                handleDeleteMember(e, member.id);
                              }}
                              _hover={{ cursor: 'pointer', color: 'red' }}
                              w={4}
                              h={4}
                            />
                          ))}
                      </Stack>
                    ))}
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
                <Flex direction="column" alignItems={'center'} my={5} gap={5}>
                  {events
                    .filter((event) => stringToJSDate(event.endTime) > new Date() || showPastEvents)
                    .sort(
                      (a, b) =>
                        stringToJSDate(b.startTime).getTime() -
                        stringToJSDate(a.startTime).getTime()
                    )
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </Flex>
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
            >
              Leave Team
            </Button>
          )}

          <Modal isOpen={isOpen} onClose={onClose}>
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
                  {isSearchUsersLoading || isAddMemberLoading ? (
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
                          onClick={(e) => handleAddMember(e, searchUser.id)}
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
                <Button variant="ghost" mr={3} onClick={handleOnClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </>
  );
};
