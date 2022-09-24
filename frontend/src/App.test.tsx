import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";

import App from "./App";

const renderWithRouter = (children: ReactNode, path: string) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={children} path={path} />
          </Routes>
        </BrowserRouter>
      </Provider>
    ),
  };
};

it("renders without crashing", () => {
  renderWithRouter(<App />, "/");
  expect(screen.getByText("Sign Up")).toBeInTheDocument();
});
