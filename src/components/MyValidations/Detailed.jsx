import React from "react";
import PropTypes from "prop-types";
// Frameworks
import { useTranslation } from "react-i18next";
// Material UI
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// Components
const BlueBar = withStyles(() => ({
  root: {
    height: 50,
    borderRadius: "0px 5px 5px 0px",
    marginRight: "1px",
  },
  colorPrimary: {
    backgroundColor: "rgba(37, 62, 102, 0.2)",
  },
  bar: {
    borderRadius: "0px 5px 5px 0px",
    backgroundColor: "#253E66",
  },
}))((props) => <LinearProgress {...props} />);
const OrangeBar = withStyles(() => ({
  root: {
    height: 50,
    borderRadius: "0px 5px 5px 0px",
  },
  colorPrimary: {
    backgroundColor: "rgba(229, 170, 23, 0.2)",
  },
  bar: {
    borderRadius: "0px 5px 5px 0px",
    backgroundColor: "#E5AA17",
  },
}))((props) => <LinearProgress {...props} />);
// Styles
const useStyles = makeStyles((theme) => ({
  ReverseBar: {
    transform: "rotate(180deg)",
    height: 50,
  },
  textContainer: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      margin: "5px 0px",
    },
  },
  textParagraph: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    },
  },
}));
// Main component
export default function Detailed({
  currency = "",
  gains = 0,
  wining = 0,
  best = 0,
  worst = 0,
  loses = 0,
  losing = 0,
  runup = 0,
  relativeRunup = 0,
  drawdown = 0,
  relativeDrawdown = 0,
}) {
  // Hooks
  const { t } = useTranslation("strategies");
  const classes = useStyles();
  const totalOperations = wining + losing;
  const averageGain = ((gains - loses) / totalOperations).toFixed(2);
  const averageTradeGain = (gains / wining).toFixed(2);
  const averageTradeLoss = (loses / losing).toFixed(2);
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      justifyContent="space-between"
    >
      <Box className={classes.textParagraph} display="flex">
        <Typography>{t("strategyTable.detail.AvgGain")}: </Typography> 
        <Typography>
          {" "}
          <Box
            component="span"
            color={averageGain >= 0 ? "#11CC9A" : "#e20e7c"}
          >
            {averageGain} {currency}
          </Box>{" "}
          {t("strategyTable.detail.trade")}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          className={classes.textContainer}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="50%"
            className={classes.textParagraph}
          >
            <Typography>
              {t("strategyTable.detail.AvgGain1")} <br />
              {/*t("strategyTable.detail.OfWinningTrades")*/}
            </Typography>
            <Box color="#1A2B47" component={Typography}>
              {averageTradeGain} {currency}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            className={classes.textParagraph}
          >
            <Typography>
              {t("strategyTable.detail.AvgLoss")} <br />
              {/*t("strategyTable.detail.OfLosingTrades")*/}
            </Typography>
            <Box component={Typography} color="#E5AA17">
              {averageTradeLoss} {currency}
            </Box>
          </Box>
        </Box>
        <Box>
          <Grid container>
            <Grid sm={6} item md={6} xs={6} lg={6}>
              <BlueBar
                value={((gains / wining) * 100) / best}
                variant="determinate"
                title="test"
                className={classes.ReverseBar}
              />
            </Grid>
            <Grid sm={6} item md={6} xs={6} lg={6}>
              <OrangeBar
                value={((Math.abs(gains) / losing) * 100) / best}
                variant="determinate"
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          className={classes.textContainer}
        >
          <Box
            display="flex"
            flexDirection="column"
            className={classes.textParagraph}
          >
            <Typography>
              {t("strategyTable.detail.GainsOfBestTrade")}
            </Typography>
            <Box component={Typography} color="#1A2B47">
              {best.toFixed(2)} {currency}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            className={classes.textParagraph}
          >
            <Typography>
              {t("strategyTable.detail.LossOfWorstTrade")}
            </Typography>
            <Box component={Typography} color="#E5AA17">
              {worst.toFixed(2)} {currency}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        className={classes.textContainer}
      >
        <Box
          display="flex"
          flexDirection="column"
          className={classes.textParagraph}
        >
          <Typography> {t("strategyTable.detail.MaxRunup")}</Typography>
          <Box component={Typography} color="#11CC9A">
            {runup.toFixed(2)} {currency} ({relativeRunup.toFixed(2)} %)
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          className={classes.textParagraph}
        >
          <Typography> {t("strategyTable.detail.MaxDrawdown")}</Typography>
          <Box component={Typography} color="#e20e7c">
            {drawdown.toFixed(2)} {currency} ({relativeDrawdown.toFixed(2)} %)
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
Detailed.propTypes = {
  currency: PropTypes.string.isRequired,
  gains: PropTypes.number.isRequired,
  wining: PropTypes.number.isRequired,
  best: PropTypes.number.isRequired,
  worst: PropTypes.number.isRequired,
  loses: PropTypes.number.isRequired,
  losing: PropTypes.number.isRequired,
  runup: PropTypes.number.isRequired,
  relativeRunup: PropTypes.number.isRequired,
  drawdown: PropTypes.number.isRequired,
  relativeDrawdown: PropTypes.number.isRequired,
};
