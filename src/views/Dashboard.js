import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Summary from "components/Dashboard/Summary";
import SharedStrategies from "components/Dashboard/SharedStrategies/";
import Strategies from "components/Dashboard/Strategies";
import News from "components/Dashboard/News";
import { makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  appBarTitleBoard: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [t] = useTranslation("global");

  return (
    <Box width="100%" height="100%" pl={3}>
      <Typography variant="h3" noWrap className={classes.appBarTitleBoard}>
        {t("titles.dashboard")}
      </Typography>
      <Grid container className="fullHeight">
        <Grid item lg={8} sm={12} xs={12}>
          <Summary />
        </Grid>
        <Grid item lg={4} sm={12} xs={12}>
          <SharedStrategies />
        </Grid>
        <Grid item lg={8} sm={12} xs={12}>
          <Strategies />
        </Grid>
        <Grid item lg={4} sm={12} xs={12}>
          <News />
        </Grid>
      </Grid>
    </Box>
  );
}
