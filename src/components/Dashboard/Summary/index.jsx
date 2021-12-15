import React from "react";
import Stadistics from "./Stadistics";
import SharedTops from "./SharedTops";
import { Grid } from "@material-ui/core";

export default function Summary() {
  return (
    <Grid container className="fullHeight">
      <Grid item lg={6} sm={12} xs={12}>
        <Stadistics />
      </Grid>
      <Grid item lg={6} sm={12} xs={12}>
        <SharedTops />
      </Grid>
    </Grid>
  );
}
