import React from "react";
import MyStrategies from "./MyStrategies";
import LastStrategy from "./LastStrategy";
import { Grid, Box } from "@material-ui/core";

export default function Strategies() {
  return (
    <Box
      bgcolor="white"
      borderRadius="10px 10px 0px 0px"
      height="100%"
      width="100%"
    >
      {/* <Box height="100%" display="flex"> */}
      <Grid container className="fullHeight">
        <Grid item lg={3} sm={4} xs={12}>
          <LastStrategy />
        </Grid>
        <Grid item lg={9} sm={8} xs={12}>
          <MyStrategies />
        </Grid>
      </Grid>
      {/* </Box> */}
    </Box>
  );
}
