import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";

it("renders without crashing", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
