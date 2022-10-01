import { useEffect, FC, ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { getSelf, selectUser, clearUserState } from "redux/slices/userSlice";
import { clearTeamState } from "redux/slices/teamsSlice";
import { useNavigate, useLocation } from "react-router-dom";

interface IProps {
  children: ReactNode;
  isProtected?: boolean;
}

export const AuthComponent: FC<IProps> = ({
  children,
  isProtected = false,
}): JSX.Element => {
  const location = useLocation();

  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.loggedIn == null) dispatch(getSelf());
    if (user.loggedIn === false && location.pathname !== "/" && isProtected)
      navigate("/");
  }, [location]);

  useEffect(() => {
    if (user.loggedIn === false) {
      dispatch(clearUserState());
      dispatch(clearTeamState());
    }
    if (user.loggedIn === false && location.pathname !== "/" && isProtected)
      navigate("/");
  }, [user.loggedIn]);

  if (!user.loggedIn && isProtected) {
    return <p>LOADING...</p>;
  }

  return <>{children}</>;
};
