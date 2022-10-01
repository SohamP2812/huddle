import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

export const BackButton = ({ fallback }: { fallback: string }) => {
  const navigate = useNavigate();

  const goBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return (
    <Button
      width={"fit-content"}
      border={"1px"}
      borderColor={"gray.400"}
      bg={"transparent"}
      p={5}
      alignItems={"center"}
      onClick={goBack}
    >
      <ArrowBackIcon w={5} h={5} />
      Back
    </Button>
  );
};
