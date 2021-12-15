import React, { useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { loadRules } from "store/reducers/builder.reducer";
import { useDispatch } from "react-redux";
import { loadStrategy } from "store/reducers/strategy.reducer";
import { Redirect } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PrimaryButton from "components/Button/PrimaryButton";
import { useTranslation } from "react-i18next";
import theme from "lib/theme";

StrategyCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  timeframe: PropTypes.string,
  asset: PropTypes.string,
  validated: PropTypes.bool,
  profit: PropTypes.number,
  risk: PropTypes.number,
  image: PropTypes.string,
  loadLastStrategy: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  containerWidth: {
    [theme.breakpoints.down("sm")]: {
      width: "75%",
    },
  },
}));

export default function StrategyCard({
  title,
  id,
  timeframe = "N/D",
  asset = "N/D",
  validated = false,
  risk = "N/D",
  profit = "N/D",
  image,
  loadLastStrategy = undefined,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [timeframesT] = useTranslation("timeframes");
  const [t] = useTranslation("dashboard");
  const [loadRedirect, setLoadRedirect] = useState("/validation");
  const [isLoaded, setLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleLoad = async (destination) => {
    const USER_ID = localStorage.getItem("user_id");
    const API_URL = `${process.env.REACT_APP_TRADEASY_API}session/${USER_ID}`;
    try {
      const body = JSON.stringify({
        origin: "M",
        strategyId: id,
        userId: USER_ID,
      });
      const response = await fetch(API_URL, {
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Load finished with errors");
      const data = await response.json();
      await dispatch(
        loadRules({
          openRules: JSON.parse(data.openScenario),
          closeRules: JSON.parse(data.closeScenario),
        })
      );
      await dispatch(
        loadStrategy({
          id: data.strategyId,
          title: data.strategyTitle,
          timeframe: data.timeframe,
          ticker: data.asset,
          balance: data.balance,
        })
      );
      setLoadRedirect(destination);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box
      flexDirection="column"
      width="100%"
      height="100%"
      display="flex"
      bgcolor="#FFF"
      border="1px solid #D7D7D9"
      borderRadius="10px"
      alignItems="center"
      justifyContent="center"
      position="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={classes.containerWidth && validated}
    >
      {
        /*If loading strategy finished, redirect to validate */
        isLoaded ? <Redirect to={loadRedirect} /> : null
      }
      {typeof loadLastStrategy === "undefined" && isHovering ? (
        <Box
          position="absolute"
          width="100%"
          height="100%"
          bgcolor="rgba(255, 255, 255, 0.7)"
          p={4}
          alignItems="center"
          justifyContent="space-evenly"
          display="flex"
          flexDirection="column"
          zIndex="2"
          className={classes.containerWidth && validated}
        >
          <PrimaryButton
            fullWidth
            onClick={
              validated && classes.hoverEffect && loadLastStrategy
                ? loadLastStrategy
                : () => handleLoad("/builder")
            }
          >
            {t("builder")}
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            onClick={
              validated && classes.hoverEffect && loadLastStrategy
                ? loadLastStrategy
                : () => handleLoad("/validation")
            }
          >
            {t("validate")}
          </PrimaryButton>
        </Box>
      ) : null}

      <Box p={2} width="100%" color="#555559">
        <Typography variant="h5" noWrap color="inherit">
          {title ? title : t("untitledStrategy")}
        </Typography>
      </Box>
      <Box position="relative" marginRight="auto" width="100%">
        {validated && (
          <Box py={1}>
            <Box display="flex" width="100%">
              <Box bgcolor="#E5AA17" color="#253E66" mr="2px" px={3}>
                <Typography color="secondary">Risk</Typography>
                <Typography variant="h5">{risk.toFixed(0)}%</Typography>
              </Box>
              <Box
                bgcolor="#253E66"
                color="#11CC9A"
                px={3}
                borderRadius="0px 5px 5px 0px"
              >
                <Typography color="secondary">Profit</Typography>
                <Typography variant="h5">{profit.toFixed(1)}%</Typography>
              </Box>
            </Box>
            <Box display="flex">
              {image ? (
                <img
                  src={image}
                  width="100%"
                  height="100%"
                  alt={`Strategy ${title}`}
                />
              ) : null}
            </Box>
          </Box>
        )}
      </Box>
      <Box
        marginTop="auto"
        width="100%"
        bgcolor="#F7F7FA"
        padding={1}
        borderRadius="0px 0px 5px 5px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="body1" color="textSecondary" component="p">
          Timeframe:{" "}
          <Typography variant="body1" color="textPrimary" component="span">
            {timeframe ? timeframesT(timeframe) : "N/D"}
          </Typography>
        </Typography>

        <Typography variant="body1" color="textSecondary" component="p">
          {t("asset")}:{" "}
          <Typography variant="body1" color="textPrimary" component="span">
            {asset ? asset : "N/D"}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
