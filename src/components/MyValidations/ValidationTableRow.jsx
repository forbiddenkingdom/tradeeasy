import React from "react";
import PropTypes from "prop-types";
// Frameworks
import moment from "moment";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
// Store
import { loadRules } from "store/reducers/builder.reducer";
import { loadStrategy } from "store/reducers/strategy.reducer";
// Material UI
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
// Assets
import "@fontsource/karla/700.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import MoreVertIcon from "@material-ui/icons/MoreVert";
// Custom Imports
import PopUpMenu from "./PopUpMenu";
import Operations from "./Operations";
import Detailed from "./Detailed";
import { loadHistoryStrategy } from "lib/helpers";
import { withStyles } from "@material-ui/styles";
import StrategyScreenShot from "components/Screenshot";

// Styles
const useStyles = makeStyles((theme) => ({
  title: {
    color: "#555559",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  switch: {
    padding: 6,
  },
  switchTrack: {
    borderRadius: 50,
  },
  cellText: {
    fontWeight: 400,
    color: "#555559",
  },
  deleteButton: {
    textTransform: "none",
    backgroundColor: "#E3170A",
  },
  expandContainer: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  expandComponent: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "5px 0px",
    },
    "&:hover $shareButton": {
      opacity: 1,
    },
  },
  shareButton: {
    opacity: 0,
    transition: "all ease 0.3s",
    [theme.breakpoints.down("md")]: {
      opacity: 1,
    },
  },
  movileRow: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  movileInfo: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  movileCell: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  tableRow: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));
// Components
const CustomButton = withStyles({
  root: {
    textTransform: "none",
    margin: "3px 0px",
  },
})((props) => (
  <Button disableElevation variant="contained" color="primary" {...props} />
));
// Main Component
export default function ValidationTableRow({
  t,
  id,
  sessionId,
  title,
  validated,
  sesionhistid,
  shared,
  profit,
  risk,
  ticker,
  tickerId,
  timeframe,
  timeframeId,
  owner,
  shareDate,
  image,
  operations,
  currency,
}) {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [destination, setDestination] = React.useState("/builder");
  const [loading, setLoading] = React.useState("idle");
  const [isCapture, setCapture] = React.useState(false);

  // Handlers
  const handleClick = (event) => setMenuAnchor(event.currentTarget);
  const handleClose = (event) => setMenuAnchor(null);

  const handleLoad = async (destination) => {
    try {
      const abortController = new AbortController();
      const userId = localStorage.getItem("user_id");
      let url = `${process.env.REACT_APP_TRADEASY_API}session/${userId}`;
      let response = await fetch(url, { signal: abortController.signal });

      if (!response.ok)
        throw new Error("My Validation fetch finished with errors.");
      let session = await response.json();

      const strategy_id = sesionhistid;

      const strategy = await loadHistoryStrategy(strategy_id);
      if (strategy.hadErrors) return;
      dispatch(
        loadRules({
          openRules: JSON.parse(strategy.openScenario),
          closeRules: JSON.parse(strategy.closeScenario),
        })
      );
      await dispatch(
        loadStrategy({
          id: strategy.strategyId,
          title: title,
          timeframe: timeframeId,
          ticker: tickerId,
        })
      );
      setDestination(destination);
      setLoading("loaded");
    } catch (err) {
      console.log("[myvalidation error]", err);
    }
  };

  const onScreenCapture = () => {
    setCapture(true);
  };

  // Main return
  return (
    <>
      {loading == "loaded" && <Redirect to={destination} />}

      {/*NORMAL ROW */}
      <Box
        component="tr"
        display="flex"
        className={classes.tableRow}
        width="100%"
        px={2}
        justifyContent="center"
        bgcolor="#EBEBF2"
        py={2}
        mt={1}
        borderRadius={expanded ? "10px 10px 0px 0px" : "10px"}
        alignItems="center"
      >
        <Box component="td" display="flex" alignItems="center" width="20%">
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon htmlColor="#8C95A3" />
            ) : (
              <ExpandMoreIcon htmlColor="#8C95A3" />
            )}
          </IconButton>
          <Typography component="h3" className={classes.title}>
            {id}
          </Typography>

          {/* Screen Capture */}
          <StrategyScreenShot
            image={image}
            operations={operations}
            currency={currency}
            isCapture={isCapture}
            setCapture={setCapture}
            title={title}
            owner={owner}
            ticker={ticker}
            timeframe={timeframe}
          />
        </Box>
        <Box
          component="td"
          display="flex"
          width="20%"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bgcolor="#253E66"
            color="#11CC9A"
            width="65px"
            px={1}
            borderRadius="10px 0px 0px 10px"
          >
            <Typography color="secondary" variant="caption">
              {t("Profit")}
            </Typography>
            <Typography variant="h5" align="center">
              {profit}%
            </Typography>
          </Box>
          <Box
            bgcolor="#E5AA17"
            color="#253E66"
            px={1}
            width="65px"
            borderRadius="0px 10px 0px 0px"
          >
            <Typography color="secondary" variant="caption">
              {t("Risk")}
            </Typography>
            <Typography variant="h5" align="center">
              {risk}%
            </Typography>
          </Box>
        </Box>
        <Box component="td" display="flex" width="20%" justifyContent="center">
          <Typography component="h4" className={classes.cellText}>
            {ticker}
          </Typography>
        </Box>
        <Box component="td" display="flex" width="20%" justifyContent="center">
          <Typography component="h4" className={classes.cellText}>
            {timeframe}
          </Typography>
        </Box>
        <Box
          component="td"
          display="flex"
          width="20%"
          justifyContent="center"
          alignItems="center"
        >
          <Typography component="p" className={classes.cellText}>
            {moment(shareDate).format("DD.MM.YYYY HH:mm:ss")}
          </Typography>
          {menuAnchor && (
            <PopUpMenu
              id={id}
              anchor={menuAnchor}
              handleClose={handleClose}
              handleLoad={() => handleLoad("/builder")}
            />
          )}
          {!expanded && (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
              color="primary"
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/*MOVILE ROW */}
      <Box
        component="tr"
        display="none"
        className={classes.movileRow}
        width="100%"
        px={2}
        justifyContent="space-between"
        bgcolor="#EBEBF2"
        py={2}
        mt={1}
        borderRadius={expanded ? "10px 10px 0px 0px" : "10px"}
        alignItems="center"
      >
        <Box component="td" display="flex" alignItems="center">
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon htmlColor="#8C95A3" />
            ) : (
              <ExpandMoreIcon htmlColor="#8C95A3" />
            )}
          </IconButton>
        </Box>
        <Box
          component="td"
          display="flex"
          justifyContent="space-evenly"
          width="100%"
          className={classes.movileCell}
        >
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            width="50%"
          >
            <Typography component="h3" className={classes.title}>
              {id}
            </Typography>
            <Box display="flex">
              <Box
                bgcolor="#253E66"
                color="#11CC9A"
                width="65px"
                px={1}
                borderRadius="10px 0px 0px 10px"
              >
                <Typography color="secondary" variant="caption">
                  {t("Profit")}
                </Typography>
                <Typography variant="h5" align="center">
                  {profit}%
                </Typography>
              </Box>
              <Box
                bgcolor="#E5AA17"
                color="#253E66"
                px={1}
                width="65px"
                borderRadius="0px 10px 0px 0px"
              >
                <Typography color="secondary" variant="caption">
                  {t("Risk")}
                </Typography>
                <Typography variant="h5" align="center">
                  {risk}%
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" className={classes.movileInfo} width="50%">
            <Box display="flex" flexDirection="column">
              <Box display="flex" flexDirection="column">
                <Typography component="h4" className={classes.cellText}>
                  <Box component="span" fontWeight={700}>
                    Timeframe:
                  </Box>{" "}
                  {moment(shareDate).format("DD.MM.YYYY HH:mm:ss")}
                </Typography>
              </Box>
              <Typography component="h4" className={classes.cellText}>
                <Box component="span" fontWeight={700}>
                  {t("strategyTable.asset")}:
                </Box>{" "}
                {ticker}
              </Typography>
              <Typography component="h4" className={classes.cellText}>
                <Box component="span" fontWeight={700}>
                  Timeframe:
                </Box>{" "}
                {timeframe}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          component="td"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {menuAnchor && (
            <PopUpMenu
              id={id}
              anchor={menuAnchor}
              handleLoad={() => handleLoad("/builder")}
              handleClose={handleClose}
            />
          )}
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/*EXPANDED CONTENT */}
      <Box component="tr" display={expanded ? "flex" : "none"} width="100%">
        <Box
          component="td"
          display="flex"
          width="100%"
          bgcolor="#EBEBF2"
          borderRadius="0px 0px 10px 10px"
          justifyContent="space-between"
          p={2}
          className={classes.expandContainer}
        >
          {validated && (
            <>
              <Box
                display="flex"
                width="30%"
                borderRadius="10px"
                p={2}
                bgcolor="#FFF"
                className={classes.expandComponent}
                position="relative"
              >
                <Detailed
                  currency={currency}
                  gains={operations.gains_only}
                  wining={operations.trades_win}
                  best={operations.best_gain}
                  worst={operations.worst_loss}
                  loses={operations.loses_only}
                  losing={operations.trades_loss}
                  bestTrade={operations.best}
                  runup={operations.runup}
                  relativeRunup={operations.relativeRunup}
                  drawdown={operations.drawdown}
                  relativeDrawdown={operations.relativeDrawdown}
                />

                <Box position="absolute" top="5px" right="5px">
                  <IconButton
                    onClick={onScreenCapture}
                    className={classes.shareButton}
                  >
                    <ShareIcon htmlColor="grey" />
                  </IconButton>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                width="50%"
                borderRadius="10px"
                bgcolor="#FFF"
                p={2}
                className={classes.expandComponent}
                position="relative"
              >
                <img src={image} width="100%" height="100%" />
                <Operations
                  wining={operations.trades_win}
                  losing={operations.trades_loss}
                  gains={operations.gains_only}
                  loses={operations.loses_only}
                  rate={operations.gain_loss_rate}
                  currency={currency}
                />

                <Box position="absolute" top="5px" right="5px">
                  <IconButton
                    onClick={onScreenCapture}
                    className={classes.shareButton}
                  >
                    <ShareIcon htmlColor="grey" />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="space-evenly"
          >
            <CustomButton
              onClick={() => handleLoad("/builder")}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t("RecoverStrategy")}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
ValidationTableRow.propTypes = {
  t: PropTypes.func.isRequired, //  Translate function
  id: PropTypes.number.isRequired, // Strategy id
  sessionId: PropTypes.number.isRequired,
  title: PropTypes.string, // Strategy title
  validated: PropTypes.string.isRequired, // Bool to check if strategy is validated
  shared: PropTypes.bool, // Bool to check if strategy is shared
  profit: PropTypes.string.isRequired, // Strategy profit
  risk: PropTypes.string.isRequired, // Strategy risk
  ticker: PropTypes.string.isRequired, // Strategy ticker
  tickerId: PropTypes.number.isRequired, // Strategy ticker
  timeframe: PropTypes.string.isRequired, // Strategy timeframe
  timeframeId: PropTypes.number.isRequired, // Strategy timeframe
  owner: PropTypes.string.isRequired, // Strategy creator
  shareDate: PropTypes.string.isRequired, // Date were strategy was shared
  image: PropTypes.string, // Strategy balance image
  operations: PropTypes.object.isRequired, // Strategy operations
  currency: PropTypes.string.isRequired, // Strategy currency
  sesionhistid: PropTypes.number.isRequired,
};
