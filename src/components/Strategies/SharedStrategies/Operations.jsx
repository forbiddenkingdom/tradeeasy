import React from "react";
import PropTypes from "prop-types";
// Frameworks
import { useTranslation } from "react-i18next";
// Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
// Assets
import StopIcon from "@material-ui/icons/Stop";
// Custom imports
import DonutChart from "components/common/DonutChart";
import theme from "lib/theme";

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up("lg")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.down("lg")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("xl")]: {
      flexDirection: "row",
    },
  },
  graphicContainer: {
    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("xl")]: {
      width: "50%",
    },
  },
  dataContainer: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
  },
}));

export default function Operations({
  currency = "",
  wining = 0,
  losing = 0,
  gains = 0,
  loses = 0,
  rate = 0,
}) {
  const winningOrders = ((wining * 100) / (losing + wining)).toFixed(2);
  // Hooks
  const classes = useStyles(theme);
  const { t } = useTranslation("strategies");
  //Main return
  return (
    <Box
      display="flex"
      width="100%"
      bgcolor="#fff"
      className={classes.container}
    >
      <Box
        width="50%"
        display="flex"
        flexDirection="column"
        px={1}
        className={classes.graphicContainer}
      >
        <Box display="flex" flexDirection="column" width="100%">
          <Box
            display="flex"
            width="100%"
            justifyContent="space-between"
            className={classes.dataContainer}
          >
            <Box
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <DonutChart
                palette={["#11CC9A", "#E20E7C"]}
                data={[
                  { asset: "Win", count: wining },
                  { asset: "Losing", count: losing },
                ]}
              />
              <Box
                position="absolute"
                component={Typography}
                fontWeight={700}
                color={rate >= 50 ? "#E20E7C" : "#11CC9A"}
                variant="h6"
              >
                {winningOrders} %
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Box display="flex" alignItems="center">
                <StopIcon htmlColor="#11CC9A" />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  component="span"
                  width="100%"
                >
                  <Typography style={{ paddingRight: "1rem" }}>
                    {t("Winning")}
                  </Typography>
                  <Typography>{wining}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <StopIcon htmlColor="#E20E7C" />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  component="span"
                  width="100%"
                >
                  <Typography style={{ paddingRight: "1rem" }}>
                    {t("Losing")}
                  </Typography>
                  <Typography>{losing}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>{t("PorWinningTrades")}</Typography>
            <Box
              component={Typography}
              color={rate >= 50 ? "#E20E7C" : "#11CC9A"}
            >
              {winningOrders} %
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        width="50%"
        display="flex"
        flexDirection="column"
        px={1}
        className={classes.graphicContainer}
      >
        <Box display="flex" flexDirection="column" width="100%">
          <Box
            display="flex"
            width="100%"
            justifyContent="space-between"
            className={classes.dataContainer}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              <DonutChart
                palette={["#11CC9A", "#E20E7C"]}
                data={[
                  { asset: "Win", count: gains.toFixed(2) },
                  { asset: "Losing", count: loses.toFixed(2) },
                ]}
              />
              <Box
                position="absolute"
                component={Typography}
                fontWeight={700}
                color={rate > 1 ? "#11CC9A" : "#E20E7C"}
                variant="h6"
              >
                {rate.toFixed(2)}
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Box display="flex" alignItems="center">
                <StopIcon htmlColor="#11CC9A" />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  component="span"
                  width="100%"
                >
                  <Typography style={{ paddingRight: "1rem" }}>
                    {t("GainsOnly")}
                  </Typography>
                  <Typography>
                    {gains.toFixed(2)} {currency}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <StopIcon htmlColor="#E20E7C" />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  component="span"
                  width="100%"
                >
                  <Typography style={{ paddingRight: "1rem" }}>
                    {t("LosesOnly")}
                  </Typography>
                  <Typography>
                    {loses.toFixed(2)} {currency}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>{t("GainLossRatio")}</Typography>
            <Box
              component={Typography}
              color={rate > 1 ? "#11CC9A" : "#E20E7C"}
            >
              {rate.toFixed(2)}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
Operations.propTypes = {
  currency: PropTypes.string.isRequired,
  wining: PropTypes.number.isRequired,
  losing: PropTypes.number.isRequired,
  gains: PropTypes.number.isRequired,
  loses: PropTypes.number.isRequired,
  rate: PropTypes.number.isRequired,
};
