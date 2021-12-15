import React, { useEffect, useState } from "react";
import PrimaryButton from "components/Button/PrimaryButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularChart from "./CircularChart";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SharedStrats() {
  const [t] = useTranslation("dashboard");
  const [sharedStrategies, setSharedStrategies] = useState([]);
  const [totalSharedStrategies, setTotalSharedStrategies] = useState(0);
  useEffect(async () => {
    // TODO: Fix sharedstrsategy fetch
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    try {
      const response = await fetch(
        `${url}strategies/user/${userId}/shared-stats`,
        {
          signal: abortController.signal,
        }
      );
      if (!response.ok)
        throw new Error("Shared stadistics fetch finished with errors ");
      const assets = await response.json();
      //const assets = [
      //  { asset: "notShared", count: 30 },
      //  { asset: "shared", count: 15 },
      //];
      let total = 0;
      assets.forEach((asset) => (total += asset["count"]));
      setTotalSharedStrategies(total);
      setSharedStrategies(assets);
    } catch (error) {
      console.error(error);
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const colors = ["#25AAE2", "#0C419D", "#E5AA17"];

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" color="textSecondary" gutterBottom>
          {t("sharedStrategies")}
        </Typography>
        <PrimaryButton
          component={Link}
          to={"/strategies"}
          endIcon={<ArrowForwardIcon color="secondary" />}
        >
          {t("shareMyStrategies")}
        </PrimaryButton>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <Box>
          <CircularChart data={sharedStrategies} palette={colors} />
        </Box>
        <Box>
          {sharedStrategies.map((asset, index) => {
            return (
              <Box display="flex" alignItems="Center" mr="20px" key={index}>
                <Box
                  bgcolor={colors[index]}
                  width="10px"
                  height="16px"
                  mr={1}
                />
                <Typography> {t(asset.asset)}</Typography>
              </Box>
            );
          })}
        </Box>
        <Box>
          {sharedStrategies.map((asset, index) => {
            return (
              <Typography key={index} color="textSecondary">
                {asset.count} {t("strategies.title")} (
                {Math.round((asset.count * 100) / totalSharedStrategies)}%)
              </Typography>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
