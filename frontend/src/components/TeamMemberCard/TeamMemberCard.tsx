import React, { useEffect, FC, useState } from 'react';
import {
  Button,
  Box,
  Stack,
  useToast,
  Center,
  Spinner,
  Text,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalFooter,
  FormLabel,
  FormControl,
  Select,
  Badge
} from '@chakra-ui/react';
import { Member } from 'utils/types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDeleteMemberMutation, useUpdateMemberMutation } from 'redux/slices/apiSlice';
import { getErrorMessage, isObjectDiff } from 'utils/misc';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
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
  const {
    isOpen: isUpdateMemberOpen,
    onOpen: onUpdateMemberOpen,
    onClose: onUpdateMemberClose
  } = useDisclosure();

  const [
    deleteMember,
    { error: deleteMemberError, isSuccess: isDeleteMemberSuccess, isLoading: isDeleteMemberLoading }
  ] = useDeleteMemberMutation();
  const [
    updateMember,
    { error: updateMemberError, isSuccess: isUpdateMemberSuccess, isLoading: isUpdateMemberLoading }
  ] = useUpdateMemberMutation();

  const [memberFields, setMemberFields] = useState<{ position: string }>({
    position: member.position
  });

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
    if (isUpdateMemberSuccess) {
      toast({
        title: 'Sent invite successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      handleOnEditMemberClose();
    }
  }, [isUpdateMemberSuccess]);

  useEffect(() => {
    if (updateMemberError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(updateMemberError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      handleOnEditMemberClose();
    }
  }, [updateMemberError]);

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

  const handleOnEditMemberClose = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    onUpdateMemberClose();
  };

  const handleChangeMemberFields = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setMemberFields({
      ...memberFields,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateMember = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    updateMember({ userId: member.id, teamId: teamId, updatedMember: memberFields });
  };

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
          <Stack gap={2} flexDirection={'row'} align={'center'}>
            <Button
              justifyContent={'left'}
              as={RouterLink}
              color={'gray.800'}
              variant={'link'}
              to={`/users/${member.id}`}
            >
              @{member.username}
            </Button>
            {member.id === userId ? (
              <Badge
                mt={'0 !important'}
                px={1}
                py={0}
                bg={'gray.200'}
                fontWeight={'700'}
                textTransform={'none'}
              >
                YOU
              </Badge>
            ) : null}
          </Stack>
          {member.position !== 'UNKNOWN' ? <Text>{position}</Text> : null}
        </Stack>
        {isDeleteMemberLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Stack gap={2} align={'center'} flexDirection={'row'}>
            {member.id === userId || isManager ? (
              <EditIcon
                onClick={onUpdateMemberOpen}
                _hover={{ cursor: 'pointer', color: 'blue.400' }}
                w={4}
                h={4}
              />
            ) : null}

            {member.id !== userId && isManager ? (
              <DeleteIcon
                onClick={(e) => {
                  handleDeleteMember(e, member.id);
                }}
                _hover={{ cursor: 'pointer', color: 'red' }}
                w={4}
                h={4}
                marginTop={'0 !important'}
              />
            ) : null}
          </Stack>
        )}
      </Stack>

      <Modal isOpen={isUpdateMemberOpen} onClose={handleOnEditMemberClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="position">
              <FormLabel>Position</FormLabel>
              <Select
                name="position"
                onChange={handleChangeMemberFields}
                value={memberFields.position}
              >
                {Object.keys(positions[sport as keyof typeof positions].nameToKey).map(
                  (position) => (
                    <option
                      key={position}
                      value={positions[sport as keyof typeof positions].nameToKey[position]}
                    >
                      {position}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleOnEditMemberClose}>
              Close
            </Button>
            <Button
              disabled={
                !isObjectDiff(memberFields, {
                  position: member.position
                })
              }
              isLoading={isUpdateMemberLoading}
              colorScheme="blue"
              onClick={handleUpdateMember}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
