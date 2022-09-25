import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { Header } from "components/Header/Header";
export const LandingPage: FC<{}> = () => {
  return (
    <>
      <Header />
      <Text fontSize={"xx-large"}>Home</Text>
    </>
  );
};
