import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import Chart from "react-apexcharts";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Backdrop from "@material-ui/core/Backdrop";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TVChart from "components/tradingview/index";
import ResultsGraphics from "components/Strategies/ResultsGraphics";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import ValidationImage from "assets/img/validation.png";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import StrategyCircularChart from "components/Strategies/StrategyCircularChart";
import ProtectedComponent from "components/Button/ProtectedComponent";
import { Lock } from "@material-ui/icons";
import LinearProgressWithLabel from "../components/common/LinearProgressBar";

import {
  changeTicker,
  changeTimeframe,
  changeStartDate,
  changeEndDate,
  changeBalance,
  changeCurrency,
  changeValidation,
} from "store/reducers/strategy.reducer";
import OperationsTable from "components/Validation/OperationsTable";
import { Fade, Modal, Tab, Tabs } from "@material-ui/core";
import { useTranslation } from "react-i18next";

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
}))(LinearProgress);

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
}))(LinearProgress);
const useStyles = makeStyles((theme) => ({
  validationGraphics: {
    overflowY: "auto",
  },
  AppBar: {
    backgroundColor: "#FBFBFD",
    top: "auto",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - 240px)`,
      marginLeft: 240,
    },
    zIndex: 50,
  },
  SecondaryButton: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
  },
  contentCard: {
    padding: 5,
  },
  Select: {
    "& div.MuiSelect-select": {
      padding: "6px 20px 7px 3px",
    },
    "& .MuiTextField-root": {
      marginRight: 3,
      width: "5rem",
    },
  },
  Select2: {
    "& .MuiTextField-root": {
      margin: "0 3px 0 0",
      width: "3rem",
      color: "blue",
    },
    "& input": {
      padding: "6px 3px 7px 3px",
    },
  },

  ReverseBar: {
    transform: "rotate(180deg)",
    height: 50,
  },
  ResultButton: {
    borderRadius: 5,
    width: 55,
    backgroundColor: "#25AAE2",
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
    color: "#FFF",
    lineHeight: 1,
  },
  StartValidationButton: {
    borderRadius: 5,
    height: 30,
    width: 200,
    backgroundColor: "#25AAE2",
    textTransform: "none",
    fontFamily: "Karla",
    color: "#FFF",
  },
  loadingScreen: {
    position: "relative",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    zIndex: 1,
  },
  validationText: {
    padding: "1rem 0px 0px 0px",
    color: "#85858C",
    lineHeight: "23px",
  },
  Tab: {
    backgroundColor: "white",
    height: 30,
    minHeight: 30,
    minWidth: 100,
    "&.Mui-selected": {
      backgroundColor: "blue",
      color: "white",
      borderRadius: "5px",
    },
  },
  TabContainer: {
    position: "fixed",
    display: "flex",
    width: "100%",
    justifyContent: "center",
    bottom: 0,
    padding: 5,
    backgroundColor: "white",
    opacity: 0.8,
    zIndex: 50,

    "& .MuiTabs-indicator": {
      display: "none",
    },
    "& .MuiTabs-root": {
      minHeight: 30,
    },
  },
  Revalidate: {
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    top: 15,
    left: 100,
    zIndex: 1101,
  },
  appBarTitleBoard: {
    paddingTop: 3,
    "@media (min-width: 960px) and (max-width: 1170px)": {
      display: "none",
    },
    "@media (min-width: 1171px)": {
      marginLeft: 30,
      marginTop: -5,
    },
  },
}));

export default function ValidationMobile() {
  const [t] = useTranslation("global");
  const classes = useStyles();
  const dispatch = useDispatch();
  const strategy = useSelector((state) => state.strategy);
  const rules = useSelector((state) => state.builder);
  const [tickers, setTickers] = useState([]);
  const [timeframes, setAllTimeframes] = useState([]);
  // const [currencies, setCurrencies] = useState([]); // TODO: Fix fixin OptiTrade
  const [symbol, setSymbol] = useState("");
  const [operations, setOperations] = useState([]); // All operations generated by the validation
  const [balanceHistory, setBalanceHistory] = useState([
    {
      data: [],
    },
  ]); // State to save all balance history generated by validation
  // let lee = balanceHistory.length;
  const [freeAvailables, setFreeAvailables] = useState([]);
  const [progressValue, setProgressValue] = useState(30);

  // TO go to the target table from row click
  const [targetRange, setTargetRange] = useState({ x1: null, x2: null });
  const onOptRowClick = (open, close) => {
    setTargetRange({ x1: open, x2: close });
  };

  // Set window value to only fetch within the strategy time range
  let d1 = new Date(strategy.startDate);
  let d2 = new Date(strategy.endDate);
  window.strategy_range = {
    from: d1.getTime() / 1000,
    to: d2.getTime() / 1000,
  };

  const [validationStatus, setValidationStatus] = useState(undefined);
  const [isSaved, setIsSaved] = useState(false); // If strategy is saved
  const [isValidating, setIsValidating] = useState(false); // Bool state to check if user is validating
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, val) => {
    setCurrentTab(val);
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
      const responseCurrencies = await fetch(`${API_URL}currencies/`, {
        signal: abortController.signal,
      });
      const responseFreeAvailables = await fetch(`${API_URL}FreeAvaliable`, {
        signal: abortController.signal,
      });

      if (!responseTickers.ok)
        throw new Error("Ticker fetch finished with errors");
      if (!responseTimeframes.ok)
        throw new Error("Timeframes fetch finished with errors");
      if (!responseCurrencies.ok)
        throw new Error("Currencies fetch finished with errors");
      if (!responseFreeAvailables.ok)
        throw new Error("FreeAvailables fetch finished with errors.");

      const dataTickers = await responseTickers.json();
      const dataTimeframes = await responseTimeframes.json();
      const dataCurrencies = await responseCurrencies.json();
      const dataFreeAvailables = await responseFreeAvailables.json();

      setTickers(dataTickers);
      setAllTimeframes(dataTimeframes);
      setValidationValues(
        dataTickers[0].currency, // TODO: Fix fixin OptiTrade
        dataTickers[0].id,
        dataTimeframes[0].id,
        dataCurrencies[0].symbol
      );
      setFreeAvailables(dataFreeAvailables);
    } catch (error) {
      console.error(error);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const setValidationValues = (currency, ticker, timeframe, symbol) => {
    strategy.currency ? null : dispatch(changeCurrency(currency));
    strategy.ticker ? null : dispatch(changeTicker(ticker));
    strategy.timeframe ? null : dispatch(changeTimeframe(timeframe));
    setSymbol(symbol);
  };
  const handleStartValidation = async () => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const body = {
      user: localStorage.getItem("user_id"),
      timeframe: strategy.timeframe,
      ticker: strategy.ticker,
      startDate: moment(strategy.startDate).format("DD/MM/YYYY"),
      endDate: moment(strategy.endDate).format("DD/MM/YYYY"),
      balance: strategy.balance,
      currency: strategy.currency,
    };

    try {
      const response = await fetch(`${API_URL}validation/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Validation failed.");
      const data = await response.json();
      setValidationStatus("N");
      startValidation(data.id);
    } catch (error) {
      console.error(error);
    }
    setIsValidating(true);
  };

  const startValidation = async (validationId) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(
        `${API_URL}validation/${validationId}/status`
      );
      const data = await response.json();
      if (data.status == "P" || data.status == "W" || data.status == "N") {
        window.timer = setTimeout(() => startValidation(validationId), 1000);
      } else if (data.status == "F") {
        setValidationStatus(data.status);
        getOperations(validationId);
        getResult(validationId);
      } else {
        setValidationStatus(data.status);
        setIsValidating(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelValidation = () => {
    if (window.timer) {
      clearTimeout(window.timer);
      setValidationStatus("F");
      setIsValidating(false);
    }
  };

  const getResult = async (validationId) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(
        `${API_URL}validation/${validationId}/results`
      );
      if (!response.ok) throw new Error("Validation results failed.");
      const data = await response.json();
      dispatch(changeValidation(data));
    } catch (error) {
      console.error(error);
    }
  };

  const saveStrategy = async (title, rules) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const open_rules = rules.filter((rule) => rule.type == "open");
    const close_rules = rules.filter((rule) => rule.type == "close");
    const body = {
      id: strategy.id,
      title: title,
      user: localStorage.getItem("user_id"),
      asset: strategy.ticker,
      timeframe: strategy.timeframe,
      startDate: strategy.startDate,
      endDate: strategy.endDate,
      balance: strategy.balance,
      currency: strategy.currency,
      open: open_rules,
      close: close_rules,
      profit: ((strategy.gain / strategy.balance) * 100).toFixed(2),
      risk: strategy.relativeDrawdown,
      gain: strategy.gain,
      trades_win: strategy.tradesWon,
      trades_loss: strategy.tradesLost,
      success_rate: strategy.successRate,
      gains_only: strategy.gainsOnly,
      loses_only: strategy.losesOnly,
      best_gain: strategy.bestGain,
      worst_losses: strategy.wostLoss,
      gain_loss_rate: strategy.gainLossRate,
      drawdown: strategy.drawdown,
      relativeDrawdown: strategy.relativeDrawdown,
      runup: strategy.runup,
      relativeRunup: strategy.relativeRunup,
      validated: true,
    };
    console.table(body);
    try {
      const response = await fetch(`${API_URL}strategies/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error("Strategy save fetch finished with errors.");
      setIsSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getOperations = async (validationId) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(
        `${API_URL}validation/${validationId}/operations`
      );
      const data = await response.json();

      const newBlanceHistory = [];
      data.map((operation) => {
        newBlanceHistory.push({
          x: moment(operation.endDate).valueOf(),
          y: operation.balance,
        });
      });
      setBalanceHistory([{ data: newBlanceHistory }]);
      setOperations(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleValidateAgain = () => {
    setValidationStatus(undefined);
    handleStartValidation();
  };
  const handleShare = async () => {
    const API_URL = `${process.env.REACT_APP_TRADEASY_API}sharedStrategies/${strategy.id}`;
    try {
      const response = await fetch(API_URL, { method: "PUT" });
      if (!response.ok) throw new Error("Share finished with errors.");
    } catch (error) {
      console.error(error);
    }
  };
  const handleTickerChange = (event) => {
    dispatch(changeTicker(event.target.value));
    const newCurrency = tickers.find(
      (ticker) => ticker.id == event.target.value
    ).currency;
    dispatch(changeCurrency(newCurrency));
  };
  const onChangeTicker = (val) => {
    handleTickerChange(val);
  };
  const onChangeTimeframe = (val) => {
    dispatch(changeTimeframe(val));
  };

  const CustomProtecter = React.forwardRef(function cus(props, ref) {
    const { payload, title, handler } = props;
    return (
      <ProtectedComponent
        innerRef={ref}
        iconTop="-30px"
        iconRight="2px"
        iconSize="20"
        iconColor="grey"
        onItemClick={handler}
        itemValue={payload.id}
      >
        <MenuItem key={payload.id} value={payload.id}>
          {title}
        </MenuItem>
      </ProtectedComponent>
    );
  });
  CustomProtecter.propTypes = {
    payload: propTypes.object,
    handler: propTypes.func,
    title: propTypes.string,
  };

  const [isAlert, setAlert] = useState(false);
  const onChangeStartDate = (date) => {
    const minDate = new Date(2020, 0, 1, 0, 0, 0, 0);
    if (
      localStorage.getItem("user_valid_count") <= 0 &&
      minDate > new Date(date)
    ) {
      setAlert(true);
      return;
    }
    dispatch(changeStartDate(date));
  };
  return (
    <>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isAlert}
          onClose={() => setAlert(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isAlert}>
            <div className={classes.paper}>
              <Box alignItems="center" justifyContent="center" display="flex">
                <Lock style={{ fontSize: 80, color: "grey" }} />
              </Box>
              <Box>
                <Typography id="transition-modal-title" variant="h4">
                  Action Required!
                </Typography>
                <p id="transition-modal-description">
                  You have to improve your membership!
                </p>
              </Box>
            </div>
          </Fade>
        </Modal>
      </div>
      <Box width="100%" height="100%">
        {isValidating ? (
          validationStatus == "F" ? (
            <>
              <Box
                pb={5}
                display="flex"
                flexDirection="row"
                width="100%"
                minHeight="100%"
              >
                {/* *************************** Tabs ******************************** */}
                <Box className={classes.TabContainer}>
                  <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="Mostrar estrategias"
                    indicatorColor="primary"
                  >
                    <Tab
                      label="Trading Chart"
                      value={0}
                      className={classes.Tab}
                    />
                    <Tab
                      label="Balance Chart"
                      value={1}
                      className={classes.Tab}
                    />
                    <Tab
                      label="Operations Details"
                      value={2}
                      className={classes.Tab}
                    />
                    <Tab label="Statistics" value={3} className={classes.Tab} />
                  </Tabs>
                </Box>

                {/* ******************** Re validate ******************************* */}
                <Box className={classes.Revalidate}>
                  <Typography
                    variant="h4"
                    noWrap
                    className={classes.appBarTitleBoard}
                  >
                    {t("titles.validation")}
                  </Typography>
                  <Button
                    className={classes.ResultButton}
                    onClick={handleValidateAgain}
                  >
                    <Typography lineHeight="1">Validate again</Typography>
                  </Button>
                  <Button
                    className={classes.ResultButton}
                    onClick={() => saveStrategy(strategy.title, rules.present)}
                  >
                    <Typography>Save</Typography>
                  </Button>
                </Box>

                {currentTab == 0 && (
                  <Box width="100%">
                    <TVChart
                      operations={operations}
                      symbol={strategy.ticker}
                      height="100%"
                      timeframe={strategy.timeframe}
                      symbols={tickers}
                      timeframes={timeframes}
                      targetRange={targetRange}
                    />
                  </Box>
                )}
                {currentTab == 1 && (
                  <Box width="100%">
                    <Chart
                      id="balanceChart"
                      type="area"
                      height="100%"
                      width="100%"
                      series={balanceHistory}
                      options={{
                        xaxis: { type: "datetime" },
                        yaxis: {
                          labels: {
                            show: true,
                            formatter: (value) => {
                              return `${value} ${symbol}`;
                            },
                          },
                        },
                        dataLabels: { enabled: false },
                        tooltip: {
                          x: { show: false, format: "dd/MM/yyyy HH:mm" },
                          y: {
                            title: {
                              formatter: () => {
                                return "Balance:";
                              },
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
                {currentTab == 2 && (
                  <Box width="100%" height="100%" overflow="auto">
                    <OperationsTable
                      operations={operations}
                      symbol={symbol}
                      onOptRowClick={onOptRowClick}
                    />
                  </Box>
                )}
                {currentTab == 3 && (
                  <Box width="100%" display="flex">
                    <Box
                      bgcolor=""
                      width="50%"
                      height="100%"
                      borderColor="grey.500"
                      p={1}
                    >
                      <Box height="auto">
                        <ResultsGraphics
                          balance={strategy.balance}
                          gain={strategy.gains.toFixed(2)}
                          winning={strategy.tradesWon}
                          losing={strategy.tradesLost}
                          winningTrades={(strategy.success * 100).toFixed(2)}
                          currency={symbol}
                          isMobile={true}
                        />
                      </Box>
                      <Card>
                        <CardContent className={classes.contentCard}>
                          <Box className={classes.contentBox}>
                            <Box>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box>
                                  <StrategyCircularChart
                                    data={[
                                      {
                                        asset: "Win",
                                        count: strategy.gainsOnly.toFixed(2),
                                      },
                                      {
                                        asset: "Losing",
                                        count: strategy.losesOnly.toFixed(2),
                                      },
                                    ]}
                                    palette={["#11CC9A", "#E20E7C"]}
                                  />
                                </Box>
                                <Box>
                                  <Box
                                    display="flex"
                                    alignItems="Center"
                                    mr="5px"
                                  >
                                    <Box
                                      bgcolor="#11CC9A"
                                      width="10px"
                                      height="16px"
                                      mr={1}
                                    />
                                    <Typography variant="h6">
                                      Gains only
                                    </Typography>
                                  </Box>

                                  <Box
                                    display="flex"
                                    alignItems="Center"
                                    mr="5px"
                                  >
                                    <Box
                                      bgcolor="#E20E7C"
                                      width="10px"
                                      height="16px"
                                      mr={1}
                                    />
                                    <Typography variant="h6">
                                      Loses only
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="h6">
                                    {strategy.gainsOnly.toFixed(2)} {symbol}
                                  </Typography>
                                  <Typography variant="h6">
                                    {strategy.losesOnly.toFixed(2)} {symbol}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                display="flex"
                                alignItems="baseline"
                                width="100%"
                                justifyContent="space-between"
                              >
                                <Typography color="textSecondary">
                                  Gain/Loss Ratio
                                </Typography>
                                <Box color="#11CC9A">
                                  <Typography variant="h5" component="div">
                                    {strategy.gainLossRate.toFixed(2)} {symbol}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box
                      bgcolor=""
                      width="50%"
                      height="100%"
                      borderColor="grey.500"
                      borderLeft={1}
                      p={1}
                    >
                      <Box height="auto" bgcolor="#F7F7FA" width="100%">
                        <Box display="flex" alignItems="baseline" my="2px">
                          <Typography color="textSecondary">
                            Avg.gain:{" "}
                          </Typography>
                          <Box
                            color={
                              (
                                (strategy.gainsOnly - strategy.losesOnly) /
                                (strategy.tradesWon + strategy.tradesLost)
                              ).toFixed(2) >= 0
                                ? "#11CC9A"
                                : "#e20e7c"
                            }
                            mx="7px"
                          >
                            <Typography variant="h6" component="div">
                              {(
                                (strategy.gainsOnly - strategy.losesOnly) /
                                (strategy.tradesWon + strategy.tradesLost)
                              ).toFixed(2)}{" "}
                              {symbol}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            component="div"
                            color="textSecondary"
                          >
                            / trade
                          </Typography>
                        </Box>
                        <Box>
                          <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-around"
                            color="#555559"
                          >
                            <Typography component="div">
                              Avg gain <br></br>of winning trades
                              <Box fontWeight={500} color="#253E66">
                                {(
                                  strategy.gainsOnly / strategy.tradesWon
                                ).toFixed(2)}{" "}
                                {symbol}
                              </Box>
                            </Typography>
                            <Typography component="div">
                              Avg loss <br></br> of losing trades
                              <Box fontWeight={500} color="#E5AA17">
                                {(
                                  strategy.losesOnly / strategy.tradesLost
                                ).toFixed(2)}{" "}
                                {symbol}
                              </Box>
                            </Typography>
                          </Box>
                          <Box my="10px">
                            <Grid container>
                              <Grid xs item>
                                <BlueBar
                                  value={
                                    ((strategy.gainsOnly / strategy.tradesWon) *
                                      100) /
                                    strategy.bestGain
                                  }
                                  variant="determinate"
                                  title="test"
                                  className={classes.ReverseBar}
                                />
                              </Grid>
                              <Grid xs item>
                                <OrangeBar
                                  value={
                                    ((Math.abs(strategy.gainsOnly) /
                                      strategy.tradesLost) *
                                      100) /
                                    strategy.bestGain
                                  }
                                  variant="determinate"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                          <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-around"
                            color="#555559"
                          >
                            <Typography component="div">
                              Gains of best trade
                              <Box color="#253E66" fontWeight={500}>
                                {strategy.bestGain.toFixed(2)} {symbol}
                              </Box>
                            </Typography>
                            <Typography component="div">
                              Loss of worst trade
                              <Box fontWeight={500} color="#E5AA17">
                                {strategy.worstLoss.toFixed(2)} {symbol}
                              </Box>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Box>
                          <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-around"
                            color="#555559"
                            my="15px"
                          >
                            <Typography component="div">
                              Max runup
                              <Box fontWeight={500} color="#11CC9A">
                                {strategy.runup.toFixed(2)} {symbol} (
                                {strategy.relativeRunup.toFixed(2)} %)
                              </Box>
                            </Typography>
                            <Typography component="div">
                              Max drawdown
                              <Box color="#E20E7C" fontWeight={500}>
                                {strategy.drawdown.toFixed(2)} {symbol} (
                                {strategy.relativeDrawdown.toFixed(2)} %)
                              </Box>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box width="100%" height="100%">
              <Backdrop
                open={validationStatus != "F"}
                className={classes.loadingScreen}
              >
                <LinearProgressWithLabel value={progressValue} />
                <Button
                  className={classes.StartValidationButton}
                  onClick={cancelValidation}
                >
                  {t("cancelValidation")}
                </Button>
              </Backdrop>
            </Box>
          )
        ) : (
          <Box width="100%" height="100%">
            <Box className={classes.Revalidate}>
              <Typography
                variant="h4"
                noWrap
                className={classes.appBarTitleBoard}
              >
                {t("titles.validation")}
              </Typography>
            </Box>

            <AppBar
              position="absolute"
              elevation={0}
              className={classes.AppBar}
            >
              <Toolbar>
                <Box display="flex" width="100%">
                  <Box
                    color="black"
                    display="flex"
                    alignItems="center"
                    width="21%"
                  >
                    <Box display="flex" width="100%" justifyContent="center">
                      <Typography>{strategy.title || "My Strategy"}</Typography>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-around"
                  >
                    <Box color="black" className={classes.Select}>
                      <Typography>Ticker</Typography>
                      <TextField
                        select
                        value={tickers.length ? strategy.ticker : ""}
                        variant="outlined"
                        className={classes.Select}
                        size="small"
                        name="ticker"
                        onChange={handleTickerChange}
                        disabled={
                          validationStatus == "N" ||
                          validationStatus == "P" ||
                          validationStatus == "W"
                        }
                      >
                        {tickers.map((ticker) => {
                          return freeAvailables.find(
                            (avail) =>
                              avail.table_id == "ticker" &&
                              avail.id == ticker.id
                          ) ? (
                            <MenuItem
                              value={ticker.id}
                              component={CustomProtecter}
                              title={ticker.display_name}
                              payload={ticker}
                              handler={onChangeTicker}
                            >
                              {ticker.display_name}
                            </MenuItem>
                          ) : (
                            <MenuItem key={ticker.id} value={ticker.id}>
                              {ticker.display_name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Box>
                    <Box color="black" className={classes.Select}>
                      <Typography>Timeframe</Typography>
                      <TextField
                        select
                        value={timeframes.length ? strategy.timeframe : ""}
                        disabled={
                          validationStatus == "N" ||
                          validationStatus == "P" ||
                          validationStatus == "W"
                        }
                        variant="outlined"
                        className={classes.Select}
                        size="small"
                        onChange={(e) =>
                          dispatch(changeTimeframe(e.target.value))
                        }
                      >
                        {timeframes.map((timeframe) => {
                          return freeAvailables.find(
                            (avail) =>
                              avail.table_id == "TIMEFRAMES" &&
                              avail.id == timeframe.id
                          ) ? (
                            <MenuItem
                              value={timeframe.id}
                              key={timeframe.id}
                              payload={timeframe}
                              title={timeframe.name}
                              handler={onChangeTimeframe}
                              component={CustomProtecter}
                            >
                              {timeframe.name}
                            </MenuItem>
                          ) : (
                            <MenuItem value={timeframe.id} key={timeframe.id}>
                              {timeframe.name}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Box>
                    <Box color="black" className={classes.Select}>
                      <Typography>Validation Range</Typography>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Box display="flex" color="black" alignItems="center">
                          <Typography>From:</Typography>
                          <DatePicker
                            value={strategy.startDate}
                            onChange={(date) => dispatch(changeStartDate(date))}
                            format="yyyy/MM/dd"
                            disabled={
                              validationStatus == "N" ||
                              validationStatus == "P" ||
                              validationStatus == "W"
                            }
                            minDate={
                              tickers.length && strategy.ticker
                                ? tickers.find(
                                    (ticker) => ticker.id == strategy.ticker
                                  ).start_date
                                : null
                            }
                            maxDate={strategy.endDate}
                          />
                          <Typography>To:</Typography>
                          <DatePicker
                            value={strategy.endDate}
                            onChange={(date) => dispatch(changeEndDate(date))}
                            format="yyyy/MM/dd"
                            disabled={
                              validationStatus == "N" ||
                              validationStatus == "P" ||
                              validationStatus == "W"
                            }
                            minDate={strategy.startDate}
                            maxDate={moment().subtract(1, "days")}
                          />
                        </Box>
                      </MuiPickersUtilsProvider>
                    </Box>
                    <Box color="black" className={classes.Select2}>
                      <Typography>Invest amount</Typography>
                      <Box display="flex">
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          value={strategy.balance}
                          disabled={
                            validationStatus == "N" ||
                            validationStatus == "P" ||
                            validationStatus == "W"
                          }
                          onChange={(e) =>
                            dispatch(changeBalance(e.target.value))
                          }
                        ></TextField>
                        <TextField
                          value={strategy.currency ? strategy.currency : ""} // TODO: Fix fixin OptiTrade
                          disabled
                          variant="outlined"
                          size="small"
                          color="primary"
                          onChange={(e) =>
                            dispatch(changeCurrency(e.target.value))
                          }
                        ></TextField>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Toolbar>
            </AppBar>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              height="100%"
            >
              {/****************************** Start Validation Screen *******************************/}

              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <img src={ValidationImage} width="50px"></img>
                <Typography className={classes.validationText}>
                  Start Validation of{" "}
                  {strategy.title ? strategy.title : "your strategy"}
                </Typography>
              </Box>
              {validationStatus == "E" ? (
                <Alert severity="error" tabIndex="0">
                  <AlertTitle>
                    There was an error while validating{" "}
                    {strategy.title ? strategy.title : "your strategy"}
                  </AlertTitle>
                  Please contact support :{" "}
                  <em>
                    <a href="mailto:info@tradeasy.tech">info@radeasy.tech</a>
                  </em>
                </Alert>
              ) : null}
              <Box>
                {" "}
                <Button
                  className={classes.StartValidationButton}
                  onClick={handleStartValidation}
                >
                  Start Validation
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
