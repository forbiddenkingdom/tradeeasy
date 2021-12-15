import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularChart from "./CircularChart";
import { useTranslation } from "react-i18next";

export default function TopAssets() {
  const [t] = useTranslation("dashboard");
  const [assets, setAssets] = useState([{ null: 0 }]);
  const [assetsTotal, setAssetsTotal] = useState(0);

  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    let assetCount = 0;
    try {
      let response = await fetch(`${url}strategies/user/${userId}/assets`, {
        signal: abortController.signal,
      });

      let data = await response.json();
      data.map((asset) => {
        assetCount = assetCount + asset.count;
      });
      setAssets(data);
    } catch (error) {
      console.error(
        "There was an unexpected error while fetching Assets, please contact support for further info. Error: " +
          error
      );
    }
    if (assets) {
      setAssetsTotal(assetCount);
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const colors = ["#25AAE2", "#0C419D", "#E5AA17", "#11CC9A", "#E20E7C"];
  return (
    <>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        {t("topassets")}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <Box>
          <CircularChart data={assets} palette={colors} />
        </Box>
        <Box>
          {assets.map((asset, index) => {
            return (
              <Box display="flex" alignItems="Center" mr="10px" key={index}>
                <Box
                  bgcolor={colors[index]}
                  width="10px"
                  height="16px"
                  mr={1}
                />
                <Typography>{asset.asset}</Typography>
              </Box>
            );
          })}
        </Box>
        <Box>
          {assets.map((asset, index) => {
            return (
              <Typography key={index} color="textSecondary" noWrap={false}>
                {asset.count} {t("strategies.title")} (
                {Math.round((asset.count * 100) / assetsTotal)}%)
              </Typography>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
