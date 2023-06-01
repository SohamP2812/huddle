import React, { useState, useEffect } from 'react';
import { useCreateImageMutation } from 'redux/slices/apiSlice';
import { Flex, FormLabel, Image, Stack, Button, Heading, Spacer, useToast } from '@chakra-ui/react';

import { useNavigate, useParams } from 'react-router-dom';

import { BackButton } from 'components/BackButton/BackButton';
import { getErrorMessage } from 'utils/misc';

export const CreateImage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { team_id, album_id } = useParams();

  const [
    createImage,
    { isLoading: isCreationLoading, isSuccess: isCreationSuccess, error: creationError }
  ] = useCreateImageMutation();

  const [selectedImage, setSelectedImage] = useState<File | Blob | MediaSource | null>(null);

  useEffect(() => {
    if (isCreationSuccess) {
      toast({
        title: 'Created successfully!',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
      navigate(`/teams/${team_id}/albums/${album_id}`);
    }
  }, [isCreationSuccess]);

  useEffect(() => {
    if (creationError) {
      toast({
        title: 'An error occurred!',
        description: getErrorMessage(creationError),
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true
      });
    }
  }, [creationError]);

  const handleCreateAlbum = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const image = new FormData();

    if (selectedImage) {
      image.append('image', selectedImage as File, (selectedImage as File).name);
    }

    if (team_id && album_id) {
      createImage({
        teamId: parseInt(team_id),
        albumId: parseInt(album_id),
        image: image
      });
    }
  };

  return (
    <>
      <Flex minH={'100vh'} pt={10} justify={'center'} bg={'gray.50'}>
        <Stack spacing={8} mx={'auto'} width={'xl'} py={12} px={6}>
          <BackButton fallback={`/teams/${team_id}/albums/${album_id}`} />
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Add an image</Heading>
          </Stack>
          <form onSubmit={handleCreateAlbum}>
            <Stack spacing={4}>
              <Stack>
                <FormLabel>Profile Picture</FormLabel>
                <Image
                  width={'75px'}
                  height={'75px'}
                  objectFit={'cover'}
                  src={selectedImage ? URL.createObjectURL(selectedImage as Blob) : undefined}
                  border={'1px'}
                  borderColor={'gray.400'}
                  background={'white'}
                  rounded={'full'}
                />
                <input
                  type={'file'}
                  accept={'image/*'}
                  onChange={(event) => {
                    setSelectedImage(event?.target?.files ? event.target.files[0] : null);
                  }}
                />
              </Stack>
              <Spacer h={'xl'} />
              <Button
                isLoading={isCreationLoading}
                type="submit"
                bg={'black'}
                color={'white'}
                _hover={{
                  bg: 'gray.600'
                }}
                disabled={!selectedImage}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </>
  );
};
