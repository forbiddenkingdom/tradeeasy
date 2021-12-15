import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import StrategyCircularChart from "./StrategyCircularChart";
// import ProfitStratsPerc from "components/Dashboard/ProfitStratsPerc";
import { useTranslation } from "react-i18next";
import CircularChart from "components/Dashboard/Summary/CircularChart";
/**
 * Calculates in percent, the change between 2 numbers.
 * e.g from 1000 to 500 = 50%
 *
 * @param {Number} oldNumber The initial value
 * @param {Number} newNumber The value that changed
 */
function getPercentageChange(oldNumber, newNumber) {
  return ((newNumber / oldNumber) * 100).toFixed(2);
}

const useStyles = makeStyles({
  root: {
    backgroundColor: "#FFF",
    borderRadius: "0px 10px 0px 0px",
    boxShadow: "none",
    height: "45%",
  },
  contentCard: {
    padding: "10px 0px 10px 0px",
  },
  contentBox: {
    paddingLeft: "2 0px",
  },
});

ResultsGraphics.propTypes = {
  gain: PropTypes.string,
  winning: PropTypes.number,
  losing: PropTypes.number,
  balance: PropTypes.string,
  currency: PropTypes.string,
  winningTrades: PropTypes.string,
  isMobile: PropTypes.bool,
};

export default function ResultsGraphics({
  gain,
  winning,
  losing,
  balance,
  currency,
  winningTrades,
  isMobile = false,
}) {
  const resultColors = ["#11CC9A", "#E20E7C"];
  const classes = useStyles();
  const [t] = useTranslation(["strategies"]);
  const NumResults = [
    { asset: "Win", count: winning },
    { asset: "Losing", count: losing },
  ];

  return (
    <Card className={classes.root}>
      <CardContent className={classes.contentCard}>
        <Box className={classes.contentBox} mx={isMobile ? "5px" : "20px"}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {t("TestResults")}
          </Typography>
          <Box>
            <Box display="flex" alignItems="baseline">
              <Typography color="textSecondary">{t("Gain")}</Typography>
              <Box color={gain >= 0 ? "#11CC9A" : "#e20e7c"} marginLeft="7px">
                <Typography variant="h6" component="p">
                  {gain} {currency} ({getPercentageChange(balance, gain)} %)
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                {isMobile ? (
                  <StrategyCircularChart
                    data={NumResults}
                    palette={resultColors}
                  />
                ) : (
                  <CircularChart data={NumResults} palette={resultColors} />
                )}
              </Box>
              <Box>
                <Box display="flex" alignItems="Center" mr="5px">
                  <Box
                    bgcolor={resultColors[0]}
                    width="10px"
                    height="16px"
                    mr={1}
                  />
                  <Typography variant="h6">{t("Winning")}</Typography>
                </Box>

                <Box display="flex" alignItems="Center" mr="20px">
                  <Box
                    bgcolor={resultColors[1]}
                    width="10px"
                    height="16px"
                    mr={1}
                  />
                  <Typography variant="h6">{t("Losing")}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6">{NumResults[0].count}</Typography>
                <Typography variant="h6">{NumResults[1].count}</Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="baseline"
              width="100%"
              justifyContent="space-between"
            >
              <Typography color="textSecondary">
                {t("PorWinningTrades")}
              </Typography>
              <Box color="#11CC9A">
                <Typography variant="h5" component="p">
                  {winningTrades} %
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
