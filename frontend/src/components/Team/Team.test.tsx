import { screen } from "@testing-library/react";
import { renderWithRouter } from "utils/testing";

import { Team } from "components/Team/Team";

it("renders without crashing", () => {
  renderWithRouter(<Team />);
});
