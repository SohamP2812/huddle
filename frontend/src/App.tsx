import React, { useState } from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { loginUser, selectLoggedIn } from "redux/slices/userSlice";

function App() {
  axios.defaults.baseURL = "http://127.0.0.1:8080";
  axios.defaults.headers.common["Authorization"] =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJTb2hhbVAxMiIsImlhdCI6MTY2MzkwNTM2MCwiZXhwIjoxNjY0NTEwMTYwfQ.pOm-V6-BdTgBLA4L4tu-EVpGP3F_ykA0h2F2I6Umlgq67jg5T6nA4C2-pGDGiV7uMOySdM0fDcn6g8joeginPA";
  // axios.defaults.withCredentials = false;
  // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  // axios.defaults.headers.common["Content-Type"] = "application/json";

  const loggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();

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

  const login = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    dispatch(loginUser(loginFields));
  };

  return (
    <div className="App">
      <header className="App-header">
        <form
          onSubmit={login}
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
          <p>Logged in: {loggedIn ? "true" : "false"}</p>
        </form>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
