import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useGetSelfQuery } from 'redux/slices/apiSlice';

export const Header: FC = () => {
  const navigate = useNavigate();

  const { data: user } = useGetSelfQuery();

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={'white'}
        color={'gray.600'}
        py={{ base: 4 }}
        px={{ base: 4, md: 10, lg: '10vw' }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'gray.200'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Image
            src={'/images/HuddleLogoBlack.png'}
            width="150px"
            onClick={() => navigate('/')}
            _hover={{
              cursor: 'pointer'
            }}
          />

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav loggedIn={!!user} />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
          {user ? (
            <Button
              as={RouterLink}
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight={600}
              color={'black'}
              variant={'link'}
              to={'/account'}
            >
              Account
            </Button>
          ) : (
            <>
              <Button
                as={RouterLink}
                fontSize={'md'}
                fontWeight={400}
                color={'black'}
                variant={'link'}
                to={'/sign-in'}
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'md'}
                fontWeight={600}
                color={'white'}
                bg={'black'}
                _hover={{
                  bg: 'gray.600'
                }}
                to={'/sign-up'}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav loggedIn={!!user} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ loggedIn }: { loggedIn: boolean | null }) => {
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} align={'center'} spacing={4}>
      {NAV_ITEMS.filter((navItem) => !navItem.protected || loggedIn).map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                p={3}
                to={navItem.href ?? '#'}
                fontSize={'lg'}
                fontWeight={500}
                color={'black'}
                rounded="xl"
                _hover={{
                  textDecoration: 'none',
                  background: 'gray.100'
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      as={RouterLink}
      to={href ?? '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ loggedIn }: { loggedIn: boolean | null }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      borderBottom={'1px'}
      borderColor={'black'}
    >
      {NAV_ITEMS.filter((navItem) => !navItem.protected || loggedIn).map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none'
        }}
      >
        <Text fontWeight={600} color={useColorModeValue('black', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link as={RouterLink} key={child.label} py={2} to={child.href ?? '#'}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  protected?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Teams',
    href: '/teams',
    protected: true
  },
  {
    label: 'Invites',
    href: '/invites',
    protected: true
  }
];
