import React from "react";
import Box from "@material-ui/core/Box";
import TopAssets from "./TopAssets";
import SharedStrats from "./SharedStrats";

export default function SharedTops() {
  return (
    <Box
      height="100%"
      width="100%"
      bgcolor="#FFF"
      display="flex"
      flexDirection="column"
      borderRadius="0px 10px 10px 0px"
    >
      <Box
        width="100%"
        height="50%"
        p={3}
        display="flex"
        flexDirection="column"
      >
        <TopAssets />
      </Box>
      <Box
        width="100%"
        height="50%"
        p={3}
        display="flex"
        flexDirection="column"
      >
        <SharedStrats />
      </Box>
    </Box>
  );
}
