import React, { FC } from 'react';
import { Badge, Center, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface IProps {
  token: string;
  teamName: string;
  managerUsername: string;
}

export const TeamInviteCard: FC<IProps> = ({ token, teamName, managerUsername }) => {
  const navigate = useNavigate();

  const handleClickCard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigate(`/invites/${token}`);
  };

  return (
    <>
      <Center py={6} w={'100%'}>
        <Stack
          borderWidth="1px"
          borderRadius="3xl"
          maxW={'540px'}
          w={'100%'}
          height={{ base: '10rem', md: '12rem' }}
          direction={{ base: 'column', md: 'row' }}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          padding={4}
          _hover={{
            transform: 'rotate(0deg) scale(1.025) translateY(3px)',
            transition: '0.25s all ease'
          }}
          transition={'0.19s all ease'}
          cursor={'pointer'}
          onClick={handleClickCard}
        >
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Heading fontSize={'3xl'} fontFamily={'body'}>
              {teamName}
            </Heading>
            <Stack align={'center'} justify={'center'} direction={'row'} pt={15}>
              <Badge
                px={2}
                py={1}
                bg={useColorModeValue('gray.50', 'gray.800')}
                fontWeight={'400'}
                textTransform={'none'}
              >
                Manager: <strong>{managerUsername}</strong>
              </Badge>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </>
  );
};
