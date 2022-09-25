import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthComponent } from "components/AuthComponent";

import { LandingPage } from "components/LandingPage/LandingPage";
import { SignUp } from "components/SignUp/SignUp";
import { SignIn } from "components/SignIn/SignIn";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<AuthComponent children={<LandingPage />} />}
            />
            <Route
              path="signup"
              element={<AuthComponent children={<SignUp />} />}
            />
            <Route
              path="signin"
              element={<AuthComponent children={<SignIn />} />}
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
