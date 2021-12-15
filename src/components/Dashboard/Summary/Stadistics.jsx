import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import PrimaryButton from "components/Button/PrimaryButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import ProfitPercNum from "./ProfitPercNum";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBuilder } from "store/reducers/builder.reducer";
import { reset } from "store/reducers/strategy.reducer";
import theme from "lib/theme";
import { loadUserStrategy } from "lib/helpers";
import { loadRules } from "store/reducers/builder.reducer";
import { loadStrategy } from "store/reducers/strategy.reducer";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#253E66",
    borderRadius: "10px 0px 0px 10px",
    height: "100%",
  },
  contentCard: {
    padding: "20px 0px 20px 0px",
  },
  btnCreateNew: {
    margin: "5px 0 5px 5px",
    [theme.breakpoints.up("sm")]: {
      padding: "10px 50px 10px 50px",
    },
  },
});

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    width: 244,
    borderRadius: 5,
    [theme.breakpoints.down("sm")]: {
      width: 130,
      marginLeft: 10,
    },
    "@media (max-width: 374px)": {
      width: 100,
      marginLeft: 10,
    },
  },
  colorPrimary: {
    backgroundColor: "#27767b",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#11CC9A",
  },
}))(LinearProgress);

const SummaryDivider = withStyles(() => ({
  root: {
    backgroundColor: "#FFFFFF",
    opacity: "0.2",
    margin: "20px 0px 20px 0px",
  },
}))(Divider);

const profitCalc = (dividend, divisor) => {
  let result = Math.round((dividend / divisor) * 100);
  return result;
};

export default function Stadistics() {
  const classes = useStyles();
  const [t] = useTranslation("dashboard");
  const dispatch = useDispatch();
  const [loadRedirect, setLoadRedirect] = useState("/builder");
  const [isLoaded, setLoaded] = useState(false);
  const [loading, setLoading] = React.useState("idle");
  const [summary, setSummary] = useState({
    built: 0,
    validated: 0,
    downloaded: 0,
    profit: 0,
    mostProfit: 0,
    stratid: 0,
  });

  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    try {
      const response = await fetch(`${url}strategies/user/${userId}/summary`, {
        signal: abortController.signal,
      });
      if (!response.ok) throw new Error("Summary fetch finished with errors.");
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error(
        "There was an unexpected error while fetching Summary, please contact support for further info. Error: " +
          error
      );
    }
    return () => {
      abortController.abort();
    };
  }, []);
  const handleCreateNew = () => {
    dispatch(resetBuilder());
    dispatch(reset());
  };

  const handleLoad = async (stratid) => {
    const strategy = await loadUserStrategy(stratid);
    console.log(stratid);
    if (strategy.hadErrors) return;
    dispatch(
      loadRules({
        openRules: JSON.parse(strategy.openScenario),
        closeRules: JSON.parse(strategy.closeScenario),
      })
    );
    await dispatch(
      loadStrategy({
        id: strategy.strategyId,
        title: strategy.strategyTitle,
        timeframe: strategy.timeframe,
        ticker: strategy.asset,
        balance: strategy.balance,
      })
    );
    //setDestination("/builder");
    setLoadRedirect("/builder");
    setLoaded(true);
  };

  return (
    <Card className={classes.root} elevation={0}>
       {
        /*If loading strategy finished, redirect to validate */
        isLoaded ? <Redirect to={loadRedirect} /> : null
      }
      <CardContent className={classes.contentCard}>
        <Box pl="20px">
          <Typography variant="h6" color="primary" gutterBottom>
            {t("summary")}
          </Typography>
          <Box display="flex" mt="16px">
            <Grid container spacing={0}>
              <Grid item lg={6} sm={6} xs={6}>
                <Box display="flex" alignItems="baseline">
                  <Typography color="secondary" variant="h4">
                    {summary.built}
                  </Typography>

                  <Typography color="secondary" variant="body1">
                    &nbsp;{t("strategies.built")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={6} sm={6} xs={6}>
                <Box
                  width="100% "
                  bgcolor="#F7F7FA"
                  borderRadius="10px 0px 0px 10px"
                >
                  <PrimaryButton
                    size="large"
                    className={classes.btnCreateNew}
                    component={Link}
                    onClick={handleCreateNew}
                    to={"/builder"}
                  >
                    {t("new")}
                  </PrimaryButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" alignItems="baseline" mt="15px">
            <Typography color="secondary" variant="h4">
              {summary.validated}
            </Typography>
            <Typography color="secondary" variant="body1">
              &nbsp;{t("strategies.validated")}
            </Typography>
          </Box>
          <Box display="flex" alignItems="baseline" mt="15px">
            <Typography color="secondary" variant="h4">
              {summary.downloaded}
            </Typography>
            <Typography color="secondary" variant="body1">
              &nbsp;{t("strategies.downloaded")}
            </Typography>
          </Box>
        </Box>
        <SummaryDivider variant="middle" />
        <Box pl="20px">
          <Box color="#CECED4 ">
            <Typography variant="subtitle1">{t("mostprofit")}</Typography>
            <Grid container spacing={2}>
              <Grid item lg={6} sm={6} xs={6}>
                <Box display="flex" alignItems="baseline">
                  <ProfitPercNum size="h5" text={`+${summary.mostProfit} %`} />
                  <Box ml="10px">
                    <Typography variant="subtitle1" color="secondary">
                      {t("morepofit")}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={6} sm={6} xs={6}>
                <Box width="90%">
                  <Button
                    fullWidth
                    color="secondary"
                    variant="outlined"
                    style={{ textTransform: "none" }}
                    onClick={() => handleLoad(summary.stratid)}
                    endIcon={<ArrowForwardIcon color="secondary" />}
                  >
                    {t("view_my_strategy")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box mr="20px" alignItems="center" mt="27px" color="#CECED4">
            <Typography variant="subtitle1">
              {t("strategies.profitable")}
            </Typography>
            <Box
              display="flex"
              alignItems="baseline"
              justifyContent="space-between"
              mt="5px"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={118}
              >
                <Typography color="secondary" variant="h4">
                  {summary.profit}/{summary.built}
                </Typography>
                <Box ml="20px">
                  <Typography color="secondary" variant="h5">
                    ({profitCalc(summary.profit, summary.built)}%)
                  </Typography>
                </Box>
              </Box>
              <BorderLinearProgress
                variant="determinate"
                value={profitCalc(summary.profit, summary.built)}
                color="primary"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
