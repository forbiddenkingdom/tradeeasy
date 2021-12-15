import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "@fontsource/catamaran";
import "@fontsource/poppins";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { loadRules } from "store/reducers/builder.reducer";
import { loadStrategy } from "store/reducers/strategy.reducer";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import PrimaryButton from "components/Button/PrimaryButton";
import ProtectedComponent from "components/Button/ProtectedComponent";

const useStyles = makeStyles({
  graph: {
    width: 100,
    marginLeft: 3,
    marginRight: 3,
    height: "100%",
    "@media (max-width: 424px)": {
      width: 50,
    },
    "@media (max-width: 375px)": {
      display: "none",
    },
  },
  number: {
    textAlign: "center",
  },
});

StrategyCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string,
  shared_date: PropTypes.string.isRequired,
  downloads: PropTypes.number.isRequired,
  timeframe: PropTypes.string,
  asset: PropTypes.string,
  risk: PropTypes.number.isRequired,
  profit: PropTypes.number.isRequired,
};

export default function StrategyCard({
  id,
  title,
  author,
  shared_date,
  downloads,
  timeframe,
  image,
  asset,
  risk,
  profit,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [t] = useTranslation("dashboard");
  const [timeframesT] = useTranslation("timeframes");
  const [isLoaded, setLoaded] = React.useState(false);
  const [destination, setDestination] = React.useState("/builder");
  const [isHovering, setIsHovering] = React.useState(false);

  const handleLoad = async (event, url) => {
    event.preventDefault();
    const USER_ID = localStorage.getItem("user_id");
    const API_URL = `${process.env.REACT_APP_TRADEASY_API}session/${USER_ID}`;
    try {
      const body = JSON.stringify({
        origin: "S",
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
      dispatch(
        loadRules({
          openRules: JSON.parse(data.openScenario),
          closeRules: JSON.parse(data.closeScenario),
        })
      );
      await dispatch(
        loadStrategy({
          id: "",
          title: data.strategyTitle,
          timeframe: data.timeframe,
          ticker: data.asset,
          balance: data.balance,
        })
      );
      setDestination(url);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };
  const isUserFree = localStorage.getItem("type_user") == "F";

  return (
    <Box
      bgcolor="#F7F7FA"
      borderRadius={5}
      height="100%"
      py={0.5}
      px={2}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      {
        /* Redirect to builder if load went succesful */
        isLoaded ? <Redirect to={destination} /> : null
      }

      {isHovering && (
        <Box
          position="absolute"
          bgcolor="rgba(255, 255, 255, 0.8)"
          alignItems="center"
          justifyContent="space-evenly"
          width="100%"
          height="100%"
          p={1}
          display="flex"
          flexDirection="column"
        >
          {isUserFree ? (
            <ProtectedComponent
              iconTop="-30px"
              iconRight="2px"
              iconSize="20"
              iconColor="grey"
            >
              <PrimaryButton onClick={(event) => handleLoad(event, "/builder")}>
                {t("builder")}
              </PrimaryButton>
            </ProtectedComponent>
          ) : (
            <PrimaryButton onClick={(event) => handleLoad(event, "/builder")}>
              {t("builder")}
            </PrimaryButton>
          )}

          {isUserFree ? (
            <ProtectedComponent
              iconTop="-30px"
              iconRight="2px"
              iconSize="20"
              iconColor="grey"
            >
              <PrimaryButton
                onClick={(event) => handleLoad(event, "/validation")}
              >
                {t("validate")}
              </PrimaryButton>
            </ProtectedComponent>
          ) : (
            <PrimaryButton
              onClick={(event) => handleLoad(event, "/validation")}
            >
              {t("validate")}
            </PrimaryButton>
          )}
        </Box>
      )}

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography component="h6" className={classes.title}>
          {title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          className={classes.downloads}
        >
          ({downloads} {t("downloads")})
        </Typography>
      </Box>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        className={classes.author}
      >
        {author ? author : "tradEAsy user"}
      </Typography>
      <Box display="flex" height="100%" justifyContent="space-between">
        <Box display="flex">
          <Box
            bgcolor="#E5AA17"
            color="#253E66"
            mr="3px"
            px={1}
            width="65px"
            height="50px"
            borderRadius="10px 0px 0px 10px"
          >
            <Typography
              color="secondary"
              variant="caption"
              className={classes.data}
            >
              Risk
            </Typography>
            <Typography variant="h5" className={classes.number}>
              {risk.toFixed(0)}%
            </Typography>
          </Box>
          <Box
            bgcolor="#253E66"
            color="#11CC9A"
            px={1}
            width="65px"
            height="50px"
            borderRadius="0px 10px 0px 0px"
          >
            <Typography
              color="secondary"
              variant="caption"
              className={classes.data}
            >
              Profit
            </Typography>
            <Typography variant="h5" className={classes.number}>
              {profit.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        <Box height="80%" display="flex" px={1} width="30%">
          <img
            src={image}
            alt="Balance of the strategy"
            width="100%"
            height="100%"
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box display="flex">
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              className={classes.data}
            >
              Timeframe:&nbsp;
            </Typography>
            <Typography variant="body2" component="p" className={classes.data}>
              {timeframe ? timeframesT(timeframe) : "N/D"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              className={classes.data}
            >
              {t("asset")}:&nbsp;
            </Typography>
            <Typography variant="body2" component="p" className={classes.data}>
              {asset ? asset : "N/D"}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              className={classes.data}
            >
              {t("created")}:&nbsp;
            </Typography>
            <Typography variant="body2" component="p" className={classes.data}>
              {moment(shared_date).format("DD.MM.YYYY")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
