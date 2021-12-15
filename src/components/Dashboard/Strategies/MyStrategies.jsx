import React from "react";

import Box from "@material-ui/core/Box";
import PrimaryButton from "components/Button/PrimaryButton";
import Typography from "@material-ui/core/Typography";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import StrategyCard from "./StrategyCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid } from "@material-ui/core";

export default function MyStrategies() {
  const [t] = useTranslation("dashboard");
  const [strategies, setStrategies] = React.useState([]);
  React.useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    try {
      const response = await fetch(`${url}strategies/user/${userId}/recent`, {
        signal: abortController.signal,
      });
      if (!response.ok)
        throw new Error("Recent strategeis fetch finished with errors.");
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      console.error(error);
    }
    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="auto"
      width="100%"
      height="100%"
    >
      <Box p={2} display="flex" width="100%" alignItems="center">
        <Typography variant="h5" color="textSecondary">
          {t("myStrategies")}
        </Typography>
        <PrimaryButton
          style={{ marginLeft: "auto" }}
          component={Link}
          to="/strategies"
          endIcon={<ArrowForwardIcon color="secondary" />}
        >
          {t("allStrategies")}
        </PrimaryButton>
      </Box>
      <Grid container className="fullHeight">
        {strategies.map((strategy) => {
          return (
            <Grid ls={4} md={4} sm={6} xs={12} key={strategy.id} item>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                pt={0}
                height="100%"
                width="100%"
              >
                <StrategyCard
                  id={strategy.id}
                  timeframe={strategy.tf && strategy.tf.name}
                  creationDate={strategy.created_at}
                  timerange={strategy.startDate}
                  asset={strategy.ticker && strategy.ticker.display_name}
                  title={strategy.title}
                  validated={strategy.validated}
                  shared={strategy.shared}
                  profit={strategy.profit}
                  risk={strategy.risk}
                  image={strategy.image}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
