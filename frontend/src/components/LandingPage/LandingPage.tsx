import '@fontsource/plus-jakarta-sans/700.css';

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSelfQuery, useGetStatsQuery } from 'redux/slices/apiSlice';
import { Text, Heading, Stack, Flex, Image, Button, Spacer, Box, Grid } from '@chakra-ui/react';
import { ChevronRightIcon, CalendarIcon, AttachmentIcon, CheckCircleIcon } from '@chakra-ui/icons';

const statisticsTitlesToNames = { Teams: 'teams', Members: 'members', Events: 'events' };

export const LandingPage: FC = () => {
  const navigate = useNavigate();

  const { data: user } = useGetSelfQuery();
  const { data: stats } = useGetStatsQuery();

  return (
    <>
      <Flex
        minH={'100vh'}
        pt={{ base: 0, md: 5 }}
        justify={'center'}
        bg={'gray.50'}
        flexDir={'column'}
      >
        <Stack
          w="100%"
          backgroundRepeat={'no-repeat'}
          objectFit={'cover'}
          bgImage={{ base: 'url("/images/NBACourtDark.jpeg")', md: '' }}
          brightness={0.1}
          gap={{ base: 10, lg: 60 }}
          alignItems={'center'}
          p={10}
          mx={'auto'}
          maxW={'1200px'}
          direction={'row'}
        >
          <Flex direction="column" gap={8}>
            <Flex direction="column">
              <Heading
                color={{ base: 'blue.400', md: 'blue.500' }}
                fontSize={50}
                fontFamily={'Plus Jakarta Sans'}
                fontWeight={'extrabold'}
              >
                Take control
              </Heading>
              <Heading
                fontSize={50}
                fontFamily={'Plus Jakarta Sans'}
                color={{ base: 'white', md: 'black' }}
                fontWeight={'extrabold'}
              >
                with better team management
              </Heading>
            </Flex>
            <Text fontSize={16} color={{ base: 'white', md: 'black' }}>
              Huddle offers a robust team management solution to ease painpoints and return the
              focus to good team performance.
            </Text>
            <Button
              border={'1px'}
              borderColor={'black'}
              bg={'black'}
              color="white"
              py={6}
              alignItems={'center'}
              width="300px"
              _hover={{ background: 'white', color: 'black' }}
              onClick={() => navigate(user ? `/teams` : `/sign-up`)}
            >
              {user ? `Your Teams` : `Get Started`} <ChevronRightIcon w={5} h={5} />
            </Button>
          </Flex>
          <Image
            maxWidth={'500px'}
            height={'700px'}
            rounded={'2xl'}
            objectFit={'cover'}
            src={'/images/NBACourt.jpeg'}
            display={{ base: 'none', md: 'block' }}
          />
        </Stack>
        <Spacer minH="200px" />
        <Stack
          textAlign={'center'}
          w="100%"
          alignItems={'center'}
          p={{ base: 2, md: 10 }}
          mx={'auto'}
          maxW={'1200px'}
          flexDir={'column'}
        >
          <Text lineHeight={'50px'} fontWeight={'bold'} fontSize={{ base: '4xl', md: '5xl' }}>
            How Huddle has helped
          </Text>
          <Spacer minH={'20px'} />
          <Flex gap={{ base: 20, md: 40 }} flexDir={{ base: 'column', md: 'row' }} m={0}>
            {Object.keys(statisticsTitlesToNames).map((title) => (
              <Flex flexDir={'column'} alignItems={'center'} key={title}>
                <Text fontWeight={'bold'} fontSize={'5xl'}>
                  {stats?.stats.find(
                    (stat) =>
                      stat.name ===
                      statisticsTitlesToNames[title as keyof typeof statisticsTitlesToNames]
                  )?.value ?? 0}
                </Text>
                <Text fontSize={'xl'}>{title}</Text>
              </Flex>
            ))}
          </Flex>
        </Stack>
        <Spacer minH="200px" />
        <Stack
          textAlign={'center'}
          w="100%"
          alignItems={'center'}
          p={{ base: 2, md: 10 }}
          mx={'auto'}
          maxW={'1200px'}
          flexDir={'column'}
        >
          <Text
            lineHeight={'50px'}
            fontWeight={'bold'}
            fontSize={{ base: '4xl', md: '5xl' }}
            mb="10px"
          >
            Complete oversight of your team
          </Text>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.600">
            Huddle provides team dashboards that provide detailed information regarding team
            members, events, images, and much more.
          </Text>
          <Spacer minH={'50px'} />
          <Box overflowY="hidden" margin="-0.5rem !important">
            <Box maxW="100%" px={{ base: 2, md: 10 }}>
              <Image
                boxShadow={'0 25px 50px -12px rgba(0, 0, 0, .25)'}
                border={'solid'}
                borderRadius={'0.5rem'}
                borderWidth={'1px'}
                borderColor={'hsla(240,4%,46%,.3)'}
                w={'100%'}
                rounded={'2xl'}
                objectFit={'cover'}
                src={'/images/TeamDashboard.jpg'}
                mx={'auto'}
              />
            </Box>
            <Box position={'relative'} w="100%">
              <Box
                w="100%"
                pt="20%"
                position="absolute"
                bottom="0"
                backgroundImage={
                  'linear-gradient(to top, #F7FAFC, #F7FAFC 50%, hsla(0,0%,100%,0) 75%)'
                }
              />
            </Box>
          </Box>
          <Spacer minH={'50px'} />
          <Grid
            rowGap={20}
            columnGap={20}
            templateColumns={{ base: 'repeat(1,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))' }}
            fontSize={'lg'}
            textAlign={'left'}
            lineHeight={8}
            p={5}
          >
            <Stack gap={3} alignItems={'start'} flexDir={'row'}>
              <CheckCircleIcon mt={1} w={5} h={5} />
              <Text m={'0 !important'}>
                <b>Manage members. </b>Invite all members of your team to Huddle and manage the
                roster online, seamlessly.
              </Text>
            </Stack>
            <Stack gap={3} alignItems={'start'} flexDir={'row'}>
              <CalendarIcon mt={1} w={5} h={5} />
              <Text m={'0 !important'}>
                <b>Create events. </b>Schedule both games and practices that will be shared with
                members of the team you choose, allowing you to record scores, locations, and more.
              </Text>
            </Stack>
            <Stack gap={3} alignItems={'start'} flexDir={'row'}>
              <AttachmentIcon mt={1} w={5} h={5} />
              <Text m={'0 !important'}>
                <b>Share photos. </b>Add albums and images to your dashboard, allowing photos to be
                viewed by every member within your team.
              </Text>
            </Stack>
          </Grid>
        </Stack>
        <Spacer minH="200px" />
        <Stack
          textAlign={'center'}
          w="100%"
          alignItems={'center'}
          p={{ base: 2, md: 10 }}
          mx={'auto'}
          maxW={'1200px'}
          flexDir={'column'}
        >
          <Text lineHeight={'50px'} fontWeight={'bold'} fontSize={{ base: '4xl', md: '5xl' }}>
            Get started with Huddle
          </Text>
          <Text fontSize={'xl'} color="gray.600">
            Simply the way your team works for good.
          </Text>
          <Spacer minH="30px" />
          <Button
            border={'1px'}
            borderColor={'black'}
            bg={'black'}
            color="white"
            py={6}
            alignItems={'center'}
            width="300px"
            _hover={{ background: 'white', color: 'black' }}
            onClick={() => navigate(user ? `/teams` : `/sign-up`)}
          >
            Get Started
          </Button>
        </Stack>
        <Spacer minH="200px" />
      </Flex>
    </>
  );
};
