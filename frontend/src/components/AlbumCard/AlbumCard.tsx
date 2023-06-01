import React from 'react';
import { Heading, Box, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TeamAlbum } from 'utils/types';

export const AlbumCard = ({ album }: { album: TeamAlbum }) => {
  const navigate = useNavigate();

  const goToAlbum = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(`albums/${album.id}`);
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
      <Stack spacing={0} align={'center'}>
        <Heading fontSize={'lg'} fontWeight={500} fontFamily={'body'}>
          {album.name}
        </Heading>
      </Stack>
    </Box>
  );
};
