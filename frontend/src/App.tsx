import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import {
  getSelf,
  login,
  logout,
  resetError,
  selectUser,
} from "redux/slices/userSlice";
import { useToast } from "@chakra-ui/react";
function App() {
  const toast = useToast();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSelf());
  }, []);

  useEffect(() => {
    if (user.error) {
      toast({
        title: "An error occurred!",
        description: user.error,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      dispatch(resetError());
    }
  }, [dispatch, toast, user.error]);

  const [loginFields, setLoginFields] = useState({
    username: "",
    password: "",
  });

  const handleChangeLoginFields = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLoginFields({
      ...loginFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(login(loginFields));
  };

  const handleGetSelf = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    dispatch(getSelf());
  };

  const handleLogout = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div className="App">
      <header className="App-header">
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={handleChangeLoginFields}
              value={loginFields.username}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={handleChangeLoginFields}
              value={loginFields.password}
            />
          </label>
          <button type="submit">Submit</button>
          <p>Logged in: {user.loggedIn ? "true" : "false"}</p>
        </form>
        <button onClick={handleGetSelf}>Get Current User</button>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Username: {user.username}</p>
        <button onClick={handleLogout}>Logout</button>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
      </header>
    </div>
  );
}

export default App;
