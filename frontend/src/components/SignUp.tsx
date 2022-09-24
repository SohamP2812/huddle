import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { getSelf, login, logout, selectUser } from "redux/slices/userSlice";
import { useToast } from "@chakra-ui/react";

function SignUp() {
  const toast = useToast();

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

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
    }
  }, [user.error]);

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
      </header>
    </div>
  );
}

export default SignUp;
