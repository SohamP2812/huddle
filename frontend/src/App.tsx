import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";

export const App: FC<{}> = () => {
  return (
    <div>
      <Link as={RouterLink} to="/signup">
        Sign Up
      </Link>
    </div>
  );
};
