import React, { useState } from 'react';
import { useGetImagesQuery } from 'redux/slices/apiSlice';
import {
  Flex,
  Button,
  Text,
  useDisclosure,
  Center,
  Spinner,
  Image,
  Stack,
  ModalBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { stringToJSDate } from 'utils/misc';
import { BackButton } from 'components/BackButton/BackButton';

export const Album = () => {
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure();
  const { team_id, album_id } = useParams();

  const { data: imagesResponse, isLoading: isImagesLoading } = useGetImagesQuery(
    { teamId: team_id ? parseInt(team_id) : 0, albumId: album_id ? parseInt(album_id) : 0 },
    {
      skip: !team_id || !album_id
    }
  );
  const images = imagesResponse?.images ?? [];

  const [imageUrl, setImageUrl] = useState('');

  const handleOnImageOpen = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, url: string) => {
    e.preventDefault();

    setImageUrl(url);
    onImageOpen();
  };

  const downloadImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const a = document.createElement('a');
    a.href = await toDataURL(imageUrl);
    a.download = 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toDataURL = async (url: string) => {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  if (isImagesLoading) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return (
    <>
      <Flex
        flexDirection={'column'}
        minH={'100vh'}
        pt={10}
        px={10}
        bg={'gray.50'}
        alignItems={'center'}
      >
        <Flex py={12} flexDir={'column'} maxW={'700px'} w={'full'}>
          <Stack spacing={8} mx={'auto'} width={'full'} py={12} px={6}>
            <BackButton fallback={`/teams/${team_id}`} />
            <Button
              as={RouterLink}
              to={'create-image'}
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
              <AddIcon w={3} h={3} /> <Text>Add an image</Text>
            </Button>
            <Stack gap={10} flexDir={'row'} flexWrap={'wrap'}>
              {[...images]
                .sort(
                  (a, b) =>
                    stringToJSDate(b.createdAt).getTime() - stringToJSDate(a.createdAt).getTime()
                )
                .map((image) => (
                  <Stack flex={{ base: '1 0 25%', sm: '1 0 30%', md: '1 0 25%' }} key={image.id}>
                    <Image
                      background={'white'}
                      _hover={{ cursor: 'pointer' }}
                      onClick={(e) => handleOnImageOpen(e, image.url)}
                      width={'200px'}
                      objectFit={'cover'}
                      src={image.url}
                    />
                  </Stack>
                ))}
            </Stack>
          </Stack>

          <Modal isOpen={isImageOpen} onClose={onImageClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Image View</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack align={'center'}>
                  <Image background={'white'} width={'400px'} objectFit={'cover'} src={imageUrl} />
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onImageClose}>
                  Close
                </Button>{' '}
                <Button colorScheme="blue" onClick={downloadImage}>
                  Download
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </>
  );
};
