import { useGetSelfQuery, useGetTeamsQuery } from 'redux/slices/apiSlice';
import { Flex, Button, Text, Spacer, Center, Spinner } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

import { sports } from 'utils/consts';

import { TeamCard } from 'components/TeamCard/TeamCard';
import { stringToJSDate } from 'utils/misc';

export const Teams = () => {
  const { data: userResponse, isLoading: isUserLoading } = useGetSelfQuery();
  const userId = userResponse?.id;
  const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery(userId ?? 0, {
    skip: !userId
  });
  const teams = teamsResponse?.teams ?? [];

  if (isUserLoading || isTeamsLoading) {
    return (
      <Center height={'84vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex
        flexDirection={'column'}
        minH={'100vh'}
        py={10}
        px={10}
        bg={'gray.50'}
        alignItems={'center'}
      >
        <Button
          as={RouterLink}
          to={'/create-team'}
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
        >
          <AddIcon w={3} h={3} /> <Text>Create A Team</Text>
        </Button>
        <Spacer py={5} flex={0} />
        {[...teams]
          .sort(
            (a, b) => stringToJSDate(b.createdAt).getTime() - stringToJSDate(a.createdAt).getTime()
          )
          .map((team) => (
            <TeamCard
              key={team.name}
              id={team.id}
              name={team.name}
              sport={sports.keyToName[team.sport as keyof typeof sports.keyToName]}
              manager={team.manager.username}
            />
          ))}
      </Flex>
    </>
  );
};
