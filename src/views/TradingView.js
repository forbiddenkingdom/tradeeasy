import React, { useState, useEffect } from "react";

import { TextField, MenuItem, Box, Typography, Grid } from "@material-ui/core";
import PrimaryButton from "components/Button/PrimaryButton";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import TVChart from "components/tradingview/index";

const useStyles = makeStyles((theme) => ({
  Select: {
    width: "100%",
  },
  SecondaryButton: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
  },
}));

export default function TradingView() {
  const [t] = useTranslation("tradingView");
  const classes = useStyles();

  const [tickers, setTickers] = useState([]);
  const [ticker, setTicker] = useState("");
  const [timeframes, setTimeframes] = useState([]);
  const [timeframe, setTimeframe] = useState("");

  const [chartTicker, setChartTicker] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState(null);

  const onShowClick = () => {
    setChartTicker(ticker);
    setChartTimeframe(timeframe);
  };

  const onGotoDateClick = () => {
    // console.log('[end]', !Object.prototype.hasOwnProperty.call(window.tvWidget, 'activeChart'));
    if (!window.tvWidget) return;
    try {
      window.tvWidget.activeChart().executeActionById("gotoDate");
    } catch (err) {
      alert("There is an error in trading view");
    }
  };

  useEffect(async () => {
    const abortController = new AbortController();
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const responseTickers = await fetch(`${API_URL}tickers/`, {
        signal: abortController.signal,
      });
      const responseTimeframes = await fetch(`${API_URL}timeframes/`, {
        signal: abortController.signal,
      });

      if (!responseTickers.ok)
        throw new Error("Ticker fetch finished with errors");
      if (!responseTimeframes.ok)
        throw new Error("Timeframes fetch finished with errors");

      const dataTickers = await responseTickers.json();
      const dataTimeframes = await responseTimeframes.json();

      setTickers(dataTickers);
      setTicker(dataTickers[0].id);
      setTimeframes(dataTimeframes);
      setTimeframe(dataTimeframes[0].id);
    } catch (error) {
      console.error(error);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Box padding={4} height="100%" width="100%" display="flex" flexDirection="column">
      <Box marginBottom="20px">
        <Grid container spacing={4}>
          <Grid item sm={4} xs={12} style={{ paddingBottom: 0 }}>
            <Box>
              <Typography>{t("ticker")}</Typography>
              <TextField
                select
                value={ticker}
                variant="outlined"
                placeholder="EURUSD"
                className={classes.Select}
                size="small"
                name="ticker"
                onChange={(e) => setTicker(e.target.value)}
              >
                {tickers.map((ticker) => (
                  <MenuItem key={ticker.id} value={ticker.id}>
                    {ticker.display_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item sm={4} xs={12} style={{ paddingBottom: 0 }}>
            <Box>
              <Typography>{t("timeframe")}</Typography>
              <TextField
                select
                value={timeframe}
                variant="outlined"
                placeholder="EURUSD"
                className={classes.Select}
                size="small"
                name="timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                {timeframes.map((timeframe) => (
                  <MenuItem key={timeframe.id} value={timeframe.id}>
                    {timeframe.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item sm={2} xs={6}>
            <Typography>&nbsp;</Typography>
            <PrimaryButton onClick={onShowClick} style={{ width: "100%" }}>
              {t("showchart")}
            </PrimaryButton>
          </Grid>
          <Grid item sm={2} xs={6}>
            <Typography>&nbsp;</Typography>
            <PrimaryButton
              onClick={onGotoDateClick}
              style={{ width: "100%" }}
              disabled={!chartTicker && !chartTimeframe}
            >
              {t("gotodate")}
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>

      <Box flex="1" boxShadow="2px 2px 3px #AAA" border="1px solid #CCC">
        {chartTicker && chartTimeframe ? (
          <TVChart
            operations={[]}
            symbol={Number(chartTicker)}
            height="100%"
            timeframe={Number(chartTimeframe)}
            symbols={tickers}
            timeframes={timeframes}
            targetRange={null}
            isHistory={true}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            textAlign="center"
          >
            <Typography variant="h3" color="primary">
              {t("showtext")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
