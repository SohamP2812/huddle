import { Center, Spinner } from '@chakra-ui/react';
import { useEffect, FC, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetSelfQuery } from 'redux/slices/apiSlice';

interface IProps {
  children: ReactNode;
  isProtected?: boolean;
}

export const AuthComponent: FC<IProps> = ({ children, isProtected = false }) => {
  const location = useLocation();

  const navigate = useNavigate();

  const { data: user } = useGetSelfQuery();

  useEffect(() => {
    // Better way to check for authenticated state? Null == logged out and Undefined == loading
    if (user == null && user !== undefined && location.pathname !== '/' && isProtected) {
      navigate('/');
    }
  }, [location, user]);

  if (!user && isProtected) {
    return (
      <Center height={'75vh'}>
        <Spinner size={'xl'} />
      </Center>
    );
  }

  return <>{children}</>;
};
