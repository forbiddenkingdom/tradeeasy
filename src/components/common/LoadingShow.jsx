import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

const LoadingShow = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingShow;
