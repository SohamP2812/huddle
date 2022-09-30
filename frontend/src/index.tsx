import "@fontsource/plus-jakarta-sans/800.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { extendTheme } from "@chakra-ui/react";

import { AuthComponent } from "components/AuthComponent";

import { LandingPage } from "components/LandingPage/LandingPage";
import { SignUp } from "components/SignUp/SignUp";
import { SignIn } from "components/SignIn/SignIn";
import { Account } from "components/Account/Account";
import { CreateTeam } from "components/CreateTeam/CreateTeam";
import { Teams } from "components/Teams/Teams";
import { Team } from "components/Team/Team";
import { CreateEvent } from "components/CreateEvent/CreateEvent";
import { Event } from "components/Event/Event";
import { EditEvent } from "components/EditEvent/EditEvent";

import { theme as baseTheme } from "theme";

const container = document.getElementById("root")!;
const root = createRoot(container);

const theme = extendTheme(
  {
    fonts: {
      heading: `'Plus Jakarta Sans', sans-serif`,
    },
  },
  baseTheme
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChakraProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<AuthComponent children={<LandingPage />} />}
              />
              <Route
                path="sign-up"
                element={<AuthComponent children={<SignUp />} />}
              />
              <Route
                path="sign-in"
                element={<AuthComponent children={<SignIn />} />}
              />
              <Route
                path="account"
                element={<AuthComponent children={<Account />} isProtected />}
              />
              <Route
                path="account"
                element={<AuthComponent children={<Account />} isProtected />}
              />
              <Route
                path="create-team"
                element={
                  <AuthComponent children={<CreateTeam />} isProtected />
                }
              />
              <Route
                path="teams"
                element={<AuthComponent children={<Teams />} isProtected />}
              />
              <Route
                path="teams/:team_id"
                element={<AuthComponent children={<Team />} isProtected />}
              />
              <Route
                path="teams/:team_id/create-event"
                element={
                  <AuthComponent children={<CreateEvent />} isProtected />
                }
              />
              <Route
                path="teams/:team_id/events/:event_id"
                element={<AuthComponent children={<Event />} isProtected />}
              />
              <Route
                path="teams/:team_id/events/:event_id/edit"
                element={<AuthComponent children={<EditEvent />} isProtected />}
              />
            </Routes>
          </BrowserRouter>
        </Provider>
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
