import { Box, Typography, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginBox= () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        bgcolor="blue"
        p="1rem"
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="bold" color="red">
          Multiverse
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "90%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        bgcolor="blue"
        boxShadow={2}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem" }}
          textAlign="center"
        >
          Welcome to Sociopedia, the Social Media for Everyone!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginBox;
