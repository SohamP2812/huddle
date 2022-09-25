import { screen } from "@testing-library/react";
import { renderWithRouter } from "utils/testing";

import { CreateTeam } from "components/CreateTeam/CreateTeam";

it("renders without crashing", () => {
  renderWithRouter(<CreateTeam />);
});
