import { Box, chakra, Container, Stack, Text, VisuallyHidden, Image } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box bg={'gray.100'} color={'gray.700'}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Image
          src={'/images/HuddleLogoBlack.png'}
          onClick={() => navigate('/')}
          width="150px"
          _hover={{
            cursor: 'pointer'
          }}
        />
        <Text>© 2023 Huddle Sports. All rights reserved.</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'GitHub'} href={'https://github.com/SohamP2812/huddle'}>
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};

const SocialButton = ({
  children,
  label,
  href
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={'blackAlpha.100'}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: 'blackAlpha.200'
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};
