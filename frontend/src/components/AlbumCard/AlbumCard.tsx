import React, { useEffect } from 'react';
import { Heading, Box, Stack, useToast, Center, Spinner } from '@chakra-ui/react';
import { useDeleteAlbumMutation } from 'redux/slices/apiSlice';
import { useNavigate } from 'react-router-dom';
import { TeamAlbum } from 'utils/types';
import { DeleteIcon } from '@chakra-ui/icons';
import { getErrorMessage } from 'utils/misc';

export const AlbumCard = ({
  album,
  teamId,
  isManager
}: {
  album: TeamAlbum;
  teamId: number;
  isManager: boolean;
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [
    deleteAlbum,
    { error: deleteAlbumError, isSuccess: isDeleteAlbumSuccess, isLoading: isDeleteAlbumLoading }
  ] = useDeleteAlbumMutation();

  useEffect(() => {
    if (isDeleteAlbumSuccess) {
      toast({
        title: 'Deleted album successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [isDeleteAlbumSuccess]);

  useEffect(() => {
    if (deleteAlbumError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(deleteAlbumError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [deleteAlbumError]);

  const goToAlbum = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(`albums/${album.id}`);
  };

  const handleDeleteAlbum = (
    e: React.MouseEvent<SVGElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number | null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      deleteAlbum({
        teamId: teamId,
        albumId: id
      });
    }
  };

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
      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
      onClick={goToAlbum}
    >
      <Stack flexDir="row" spacing={0} align={'center'} position={'relative'}>
        <Heading
          textAlign={'center'}
          width={'100%'}
          fontSize={'lg'}
          fontWeight={500}
          fontFamily={'body'}
        >
          {album.name}
        </Heading>
        <Box position={'absolute'} right={0}>
          {isDeleteAlbumLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              {isManager ? (
                <DeleteIcon
                  onClick={(e) => {
                    handleDeleteAlbum(e, album.id);
                  }}
                  _hover={{ cursor: 'pointer', color: 'red' }}
                  w={4}
                  h={4}
                  marginTop={'0 !important'}
                />
              ) : null}
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
};
