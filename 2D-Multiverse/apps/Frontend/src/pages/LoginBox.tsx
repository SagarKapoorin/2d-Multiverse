import { Box, useMediaQuery } from "@mui/material";
import Form from "./Form";
import Text from "../components/Text";

const LoginBox= () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        bgcolor="transparent"
        p="1rem"
        mr="1rem"
        textAlign="center"
      >
        <Text/>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "90%"}
        m="1.6rem auto"
        bgcolor="transparent"
      >
        <Form />
      </Box>
    </Box>
  );
};

export default LoginBox;
