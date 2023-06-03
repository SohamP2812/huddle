import React, { useEffect, FC } from 'react';
import { Button, Box, Stack, useToast, Center, Spinner, Text } from '@chakra-ui/react';
import { Member } from 'utils/types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDeleteMemberMutation } from 'redux/slices/apiSlice';
import { getErrorMessage } from 'utils/misc';
import { DeleteIcon } from '@chakra-ui/icons';
import { positions } from 'utils/consts';

interface IProps {
  member: Member;
  isManager: boolean;
  userId: number;
  teamId: number;
  sport: string;
}

export const TeamMemberCard: FC<IProps> = ({ member, isManager, userId, teamId, sport }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [
    deleteMember,
    { error: deleteMemberError, isSuccess: isDeleteMemberSuccess, isLoading: isDeleteMemberLoading }
  ] = useDeleteMemberMutation();

  const handleDeleteMember = (
    e: React.MouseEvent<SVGElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number | null
  ) => {
    e.preventDefault();
    if (id) {
      deleteMember({
        userId: id,
        teamId: teamId
      });
    }
  };

  useEffect(() => {
    if (isDeleteMemberSuccess) {
      if (isManager) {
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

  const position = positions[sport as keyof typeof positions].keyToName[member.position];

  return (
    <Box
      background={'gray.50'}
      height={'fit-content'}
      w={'full'}
      border={'1px'}
      borderColor={'gray.300'}
      rounded={'xl'}
      py={7}
      px={5}
    >
      <Stack justify={'space-between'} align="center" direction="row" spacing={0}>
        <Stack>
          <Button as={RouterLink} color={'gray.800'} variant={'link'} to={`/users/${member.id}`}>
            @{member.username}
          </Button>
          {member.position !== 'UNKNOWN' ? <Text>{position}</Text> : null}
        </Stack>
        {member.id !== userId &&
          isManager &&
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
    </Box>
  );
};
