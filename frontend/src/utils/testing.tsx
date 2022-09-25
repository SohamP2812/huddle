import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";

export const renderWithRouter = (children: ReactNode) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={children} path="/" />
          </Routes>
        </BrowserRouter>
      </Provider>
    ),
  };
};
