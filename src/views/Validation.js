import React, { useEffect, useRef, useState } from "react";
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
import MuiTab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, withStyles } from "@material-ui/core/styles";
// import SummaryIcon from "assets/icons/SummaryIcon";
import MenuItem from "@material-ui/core/MenuItem";
import TVChart from "components/tradingview/index";
import ResultsGraphics from "components/Strategies/ResultsGraphics";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import ValidationImage from "assets/img/validation.png";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import CircularChart from "components/Dashboard/Summary/CircularChart";
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
import { useTranslation } from "react-i18next";
import ProtectedComponent from "components/Button/ProtectedComponent";
import { Fade, Modal } from "@material-ui/core";
import { Lock } from "@material-ui/icons";
import LinearProgressWithLabel from "../components/common/LinearProgressBar";

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
const Tab = withStyles({
  root: {
    minHeight: "unset",
    paddingTop: "0px",
    paddingBottom: "0px",
    borderRadius: "3px",
    textTransform: "none",
    fontFamily: "Karla",
    minWidth: "unset",
  },
  selected: {
    backgroundColor: "#25AAE2",
    color: "#FFFFFF",
  },
})(MuiTab);
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
  root: {
    backgroundColor: "#FFF",
    borderRadius: "0px 10px 0px 0px",
    boxShadow: "none",
    height: "45%",
  },
  typeSelector: {
    minHeight: "unset",
    backgroundColor: "#FFF",
    margin: "0px 10px 0px 0px",
    padding: 2,
    borderRadius: 5,
    "& .MuiTabs-indicator": {
      display: "none",
    },
  },
  contentCard: {
    padding: "0px 0px 20px 0px",
  },
  contentBox: {
    paddingLeft: "2 0px",
  },
  validationGraphics: {
    overflowY: "auto",
  },
  AppBar: {
    backgroundColor: "#FBFBFD",
    top: "auto",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - 240px)`,
      marginLeft: 240,
    },
    zIndex: 0,
  },
  AppBarClose: {
    backgroundColor: "#FBFBFD",
    top: "auto",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - 70px)`,
      marginLeft: 240,
    },
    zIndex: 0,
  },
  SecondaryButton: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
  },

  Select: {
    "& .MuiTextField-root": {
      width: "22ch",
    },
  },
  Select2: {
    "& .MuiTextField-root": {
      width: "77px",
      color: "blue",
    },
  },
  ReverseBar: {
    transform: "rotate(180deg)",
    height: 50,
  },
  ResultButton: {
    borderRadius: 5,
    width: 100,
    height: 64,
    backgroundColor: "#25AAE2",
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
    color: "#FFF",
  },
  StartValidationButton: {
    borderRadius: 5,
    height: 42,
    width: 280,
    backgroundColor: "#25AAE2",
    textTransform: "none",
    fontFamily: "Karla",
    color: "#FFF",
    marginTop: "15px",
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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: "flex",
  },
}));

export default function Validation() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const handleSuccessClose = () => setSuccess(false);
  const [error, setError] = useState(false);
  const handleErrorClose = () => setError(false);
  const strategy = useSelector((state) => state.strategy);
  const scenario = useSelector((state) => state.builder);
  const [t] = useTranslation("validation");
  const [timeframesT] = useTranslation("timeframes");
  const [selectedChart, setSelectedChart] = useState("0");
  const handleSelectedChartChange = (event, value) => {
    setSelectedChart(value);
  };
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
  const [isValidating, setIsValidating] = useState(false); // Bool state to check if user is validating
  const balanceChartReference = useRef(); // Reference for the chart component

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

  const updateChartImage = async (valId) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const { imgURI } = await balanceChartReference.current.chart.dataURI();
    try {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > 40000) {
          break;
        }
      }
      const response = await fetch(
        `${API_URL}validation/${valId}/updateBalanceChart`,
        {
          method: "PUT",
          body: JSON.stringify({ image: imgURI }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("Balance chart update finished with errors.");
    } catch (error) {
      console.error(error);
    }
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

    const abortController = new AbortController();
    try {
      const responseCurrencies = await fetch(`${API_URL}currencies/`, {
        signal: abortController.signal,
      });
      if (!responseCurrencies.ok)
        throw new Error("Currencies fetch finished with errors");

     const dataCurrencies = await responseCurrencies.json();
     const newSymbol = dataCurrencies.find(
      (curreny) => curreny.name == strategy.currency).symbol;
     setSymbol(newSymbol);
    } catch (error) {
      console.error(error);
    }

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

      if (window.validationCancel == true) return;

      if (data.status == "P" || data.status == "W" || data.status == "N") {
        setProgressValue(data.progress);
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
      window.validationCancel = true;
      setTimeout(() => (window.validationCancel = false), 1500);
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
      const { imgURI } = await balanceChartReference.current.chart.dataURI();
      data.image = imgURI;
      dispatch(changeValidation(data));
    } catch (error) {
      console.error(error);
    }
  };

  const saveStrategy = async (title, rules) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const open_rules = rules.filter((rule) => rule.type == "open");
    const close_rules = rules.filter((rule) => rule.type == "close");
    const { imgURI } = await balanceChartReference.current.chart.dataURI();
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
      image: imgURI,
    };
    try {
      const response = await fetch(`${API_URL}strategies/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error("Strategy save fetch finished with errors.");
      setSuccess(true);
    } catch (error) {
      setError(true);
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
      setTimeout(updateChartImage(validationId), 500);
    } catch (error) {
      console.error(error);
    }
  };
  const handleValidateAgain = () => {
    setValidationStatus(undefined);
    handleStartValidation();
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
    if (localStorage.getItem("type_user") == "F" && minDate > new Date(date)) {
      setAlert(true);
      return;
    }
    dispatch(changeStartDate(date));
  };

  const UrlPath = window.location.pathname.split("/")[1];
  let isDashboard = UrlPath == "dashboard" ? true : false;
  const isUserFree = localStorage.getItem("type_user") == "F";

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
                <div id="transition-modal-description">
                  You have to improve your membership!
                </div>
              </Box>
            </div>
          </Fade>
        </Modal>
      </div>

      <AppBar
        position="absolute"
        elevation={0}
        className={isDashboard ? classes.AppBar : classes.AppBarClose}
      >
        <Toolbar>
          <Box display="flex" width="100%">
            <Box color="black" display="flex" alignItems="center" px={2}>
              <Box display="flex" width="100%">
                <Typography>
                  {strategy.title ? strategy.title : t("yourStrategy")}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifySelf="center">
              <Box color="black" className={classes.Select} px={1}>
                <Typography>{t("ticker")}</Typography>
                <TextField
                  select
                  value={tickers.length ? strategy.ticker : ""}
                  variant="outlined"
                  placeholder="EURUSD"
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
                        avail.table_id == "ticker" && avail.id == ticker.id
                    ) && isUserFree ? (
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
              <Box color="black" className={classes.Select} px={1}>
                <Typography>{t("timeframe")}</Typography>
                <TextField
                  select
                  value={timeframes.length ? strategy.timeframe : ""}
                  placeholder="1 Hour"
                  disabled={
                    validationStatus == "N" ||
                    validationStatus == "P" ||
                    validationStatus == "W"
                  }
                  variant="outlined"
                  className={classes.Select}
                  size="small"
                  onChange={(e) => dispatch(changeTimeframe(e.target.value))}
                >
                  {timeframes.map((timeframe) => {
                    return freeAvailables.find(
                      (avail) =>
                        avail.table_id == "TIMEFRAMES" &&
                        avail.id == timeframe.id
                    ) && isUserFree ? (
                      <MenuItem
                        value={timeframe.id}
                        key={timeframe.id}
                        payload={timeframe}
                        title={timeframe.name}
                        handler={onChangeTimeframe}
                        component={CustomProtecter}
                      >
                        {timeframesT(timeframe.name)}
                      </MenuItem>
                    ) : (
                      <MenuItem value={timeframe.id} key={timeframe.id}>
                        {timeframesT(timeframe.name)}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
              <Box color="black" className={classes.Select} px={1}>
                <Typography>{t("range")}</Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box display="flex" color="black" alignItems="center">
                    <Typography>{t("from")}:</Typography>
                    <DatePicker
                      style={{ paddingLeft: "8px" }}
                      value={strategy.startDate}
                      onChange={(date) => onChangeStartDate(date)}
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
                    <Typography>{t("to")}:</Typography>
                    <DatePicker
                      style={{ paddingLeft: "8px" }}
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
              <Box color="black" className={classes.Select2} px={1}>
                <Typography>{t("amount")}</Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="EUR"
                  type="number"
                  value={strategy.balance}
                  style={{ width: 100 }}
                  disabled={
                    validationStatus == "N" ||
                    validationStatus == "P" ||
                    validationStatus == "W"
                  }
                  onChange={(e) => dispatch(changeBalance(e.target.value))}
                ></TextField>
                <TextField
                  // select // TODO: Fix fixin OptiTrade
                  // value={currencies.length ? strategy.currency : ""} // TODO: Fix fixin OptiTrade
                  value={strategy.currency ? strategy.currency : ""} // TODO: Fix fixin OptiTrade
                  /*
                  disabled={
                    validationStatus == "N" ||
                    validationStatus == "P" ||
                    validationStatus == "W"
                  }
                  */ // TODO: Fix fixin OptiTrade
                  disabled
                  style={{ paddingLeft: "8px" }}
                  variant="outlined"
                  className={classes.Select}
                  size="small"
                  color="primary"
                  onChange={(e) => dispatch(changeCurrency(e.target.value))}
                >
                  {/* // TODO: Fix fixin OptiTrade
                  currencies
                    ? currencies.map((currency) => {
                        return (
                          <MenuItem value={currency.name} key={currency.id}>
                            {currency.name}
                          </MenuItem>
                        );
                      })
                    : null*/}
                </TextField>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box width="100%" height="100%">
        {isValidating ? (
          validationStatus == "F" ? (
            <Box
              height="100%"
              pt={10}
              display="flex"
              flexDirection="row"
              width="100%"
            >
              <Box
                width="70%"
                height="100%"
                display="flex"
                flexDirection="column"
                className={classes.validationGraphics}
              >
                <TVChart
                  operations={operations}
                  symbol={strategy.ticker.toString()}
                  height="60%"
                  timeframe={strategy.timeframe.toString()}
                  symbols={tickers}
                  timeframes={timeframes}
                  targetRange={targetRange}
                />
                <Box width="100%" display="flex" justifyContent="center">
                  <Tabs
                    value={selectedChart}
                    onChange={handleSelectedChartChange}
                    className={classes.typeSelector}
                  >
                    <Tab label={t("balanceChart")} value="0" />
                    <Tab label={t("operationsDetail")} value="1" />
                  </Tabs>
                </Box>
                <Box height="40%" display="flex" width="100%">
                  <TabContext value={selectedChart}>
                    <TabPanel value="0" style={{ width: "100%" }}>
                      <Chart
                        id="balanceChart"
                        ref={balanceChartReference}
                        type="area"
                        height="100%"
                        width="100%"
                        series={balanceHistory}
                        options={{
                          xaxis: {
                            type: "datetime",
                            tooltip: {
                              enabled: false,
                            },
                          },
                          chart: {
                            animations: {
                              enabled: false,
                            },
                          },
                          markers: {
                            size: 0,
                          },
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
                            enabled: true,
                            followCursor: true,
                            x: {
                              show: true,
                              format: "dd/MM/yyyy HH:mm",
                            },
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
                    </TabPanel>
                    <TabPanel
                      value="1"
                      style={{ width: "100%", paddingTop: "0" }}
                    >
                      <OperationsTable
                        operations={operations}
                        symbol={symbol}
                        onOptRowClick={onOptRowClick}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              </Box>
              <Box
                bgcolor=""
                width="30%"
                height="100%"
                borderColor="grey.500"
                borderLeft={2}
              >
                <Box>
                  <Box height="auto">
                    <ResultsGraphics
                      balance={strategy.balance}
                      gain={strategy.gain.toFixed(2)}
                      winning={strategy.tradesWon}
                      losing={strategy.tradesLost}
                      winningTrades={(strategy.successRate * 100).toFixed(2)}
                      currency={symbol}
                    />
                  </Box>
                  <Card className={classes.root}>
                    <CardContent className={classes.contentCard}>
                      <Box className={classes.contentBox} mx="20px">
                        <Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <CircularChart
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
                              <Box display="flex" alignItems="Center" mr="20px">
                                <Box
                                  bgcolor="#11CC9A"
                                  width="10px"
                                  height="16px"
                                  mr={1}
                                />
                                <Typography variant="h6">
                                  {t("GainsOnly")}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="Center" mr="20px">
                                <Box
                                  bgcolor="#E20E7C"
                                  width="10px"
                                  height="16px"
                                  mr={1}
                                />
                                <Typography variant="h6">
                                  {t("LosesOnly")}
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
                              {t("GainLossRatio")}
                            </Typography>
                            <Box color="#11CC9A">
                              <Typography variant="h5" component="p">
                                {strategy.gainLossRate.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Box
                    height="auto"
                    bgcolor="#F7F7FA"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    px={3}
                  >
                    <Box display="flex" alignItems="baseline">
                      <Typography color="textSecondary">
                        {t("AvgGain")}:
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
                        <Typography variant="h6" component="p">
                          {(
                            (strategy.gainsOnly - strategy.losesOnly) /
                            (strategy.tradesWon + strategy.tradesLost)
                          ).toFixed(2)}{" "}
                          {symbol}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        component="p"
                        color="textSecondary"
                      >
                        {t("trade")}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Box
                        display="flex"
                        width="100%"
                        color="#555559"
                        justifyContent="space-between"
                      >
                        <Typography>
                          {t("AvgGain1")} <br />
                          {/*t("OfWinningTrades")*/}
                          <Box fontWeight={500} color="#253E66">
                            {(strategy.gainsOnly / strategy.tradesWon).toFixed(
                              2
                            )}{" "}
                            {symbol}
                          </Box>
                        </Typography>
                        <Typography>
                          {t("AvgLoss")} <br />
                          {/*t("OfLosingTrades")*/}
                          <Box fontWeight={500} color="#E5AA17">
                            {(strategy.losesOnly / strategy.tradesLost).toFixed(
                              2
                            )}{" "}
                            {symbol}
                          </Box>
                        </Typography>
                      </Box>
                      <Box>
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
                        color="#555559"
                        justifyContent="space-between"
                      >
                        <Typography>
                          {t("GainsOfBestTrade")}
                          <Box color="#253E66" fontWeight={500}>
                            {strategy.bestGain.toFixed(2)} {symbol}
                          </Box>
                        </Typography>
                        <Typography>
                          {t("LossOfWorstTrade")}
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
                        color="#555559"
                        px={3}
                        py={1}
                        justifyContent="space-between"
                      >
                        <Typography>
                          {t("MaxRunup")}
                          <Box fontWeight={500} color="#11CC9A">
                            {strategy.runup.toFixed(2)} {symbol} (
                            {strategy.relativeRunup.toFixed(2)} %)
                          </Box>
                        </Typography>
                        <Typography>
                          {t("MaxDrawdown")}
                          <Box color="#E20E7C" fontWeight={500}>
                            {strategy.drawdown.toFixed(2)} {symbol} (
                            {strategy.relativeDrawdown.toFixed(2)} %)
                          </Box>
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="center">
                        <ProtectedComponent
                          isValid={true}
                          iconTop="20px"
                          iconRight="3px"
                          iconSize="20"
                          iconColor="grey"
                        >
                          <div>
                            <Button
                              className={classes.ResultButton}
                              onClick={handleValidateAgain}
                            >
                              {t("validateAgain")}
                            </Button>
                          </div>
                        </ProtectedComponent>
                        <Button
                          className={classes.ResultButton}
                          onClick={() =>
                            saveStrategy(strategy.title, scenario.present.rules)
                          }
                        >
                          {t("save")}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
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
          <Box
            pt={10}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
          >
            <Box
              p={2}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <img src={ValidationImage}></img>
              <Typography className={classes.validationText}>
                {t("startValidationHint")}{" "}
                {strategy.title ? strategy.title : t("yourStrategy")}
              </Typography>
            </Box>
            {validationStatus == "E" ? (
              <Alert severity="error" tabIndex="0">
                <AlertTitle>
                  There was an error while validating{" "}
                  {strategy.title ? strategy.title : t("yourStrategy")}
                </AlertTitle>
                Please contact support :{" "}
                <em>
                  <a href="mailto:info@tradeasy.tech">info@radeasy.tech</a>
                </em>
              </Alert>
            ) : null}

            <Box p={2}>
              {" "}
              <ProtectedComponent
                isValid={true}
                iconTop="-30px"
                iconRight="-1px"
                iconSize="20"
                iconColor="grey"
              >
                <div>
                  <Button
                    className={classes.StartValidationButton}
                    onClick={() => handleStartValidation()}
                  >
                    {t("startValidation")}
                  </Button>
                </div>
              </ProtectedComponent>
            </Box>
          </Box>
        )}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
        >
          <Alert
            elevation={1}
            variant="filled"
            onClose={handleSuccessClose}
            severity="success"
          >
            Your strategy was saved succesfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
        >
          <Alert
            elevation={1}
            variant="filled"
            onClose={handleErrorClose}
            severity="error"
          >
            There was an error saving your strategy.
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
