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
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

import { makeStyles } from "@material-ui/core/styles";
// Assets
import "@fontsource/karla/700.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
// Custom Imports
import PopUpMenu from "./PopUpMenu";
import Operations from "./Operations";
import Detailed from "./Detailed";
import { loadUserStrategy } from "lib/helpers";
import { withStyles } from "@material-ui/styles";
import ProtectedComponent from "components/Button/ProtectedComponent";
import StrategyScreenShot from "../../Screenshot";
import { useTranslation } from "react-i18next";

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
    "&:hover &shareButton": {
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
  title,
  validated,
  shared,
  profit,
  risk,
  ticker,
  timeframe,
  owner,
  shareDate,
  image,
  operations,
  currency,
  setRefrestStragety,
  refreshStrategy,
}) {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [clientShared, setClientShared] = React.useState(shared);
  const [destination, setDestination] = React.useState("/builder");
  const [loading, setLoading] = React.useState("idle");
  const [deleted, setDeleted] = React.useState(false);
  const [isCapture, setCapture] = React.useState(false);
  const [timeframeT] = useTranslation("timeframes");
  // Handlers
  const handleClick = (event) => setMenuAnchor(event.currentTarget);
  const handleClose = (event) => setMenuAnchor(null);
  const handleShare = async (event) => {
    const url = `${process.env.REACT_APP_TRADEASY_API}sharedStrategies/${id}`;
    if (event.target.checked) {
      try {
        const response = await fetch(url, { method: "PUT" });
        if (!response.ok) throw new Error("Share finished with errors.");
        setClientShared(true);
      } catch (error) {
        console.error(error);
      }
    } else if (!event.target.checked) {
      try {
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) throw new Error("Delete share finished with errors.");
        setClientShared(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLoad = async (destination) => {
    const strategy = await loadUserStrategy(id);
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
        title: strategy.strategyTitle,
        timeframe: strategy.timeframe,
        ticker: strategy.asset,
        balance: strategy.balance,
      })
    );
    setDestination(destination);
    setLoading("loaded");
  };
  const handleDelete = async () => {
    const url = `${process.env.REACT_APP_TRADEASY_API}strategies/${id}`;
    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete finished with errors.");
      setDeleted(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDuplicate = async () => {
    console.log("[Duplicate]");
    const url = `${process.env.REACT_APP_TRADEASY_API}strategies/${id}/duplicate`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Duplicate finished with errors.");
      setRefrestStragety(!refreshStrategy);
    } catch (error) {
      console.error(error);
    }
  };
  const onScreenCapture = () => {
    setCapture(true);
  };

  if (deleted) return <></>;
  // if (isDuplicated) return <></>;
  // Main return
  return (
    <>
      {loading == "loaded" && <Redirect to={destination} />}

      {/* Screen Capture */}
      <StrategyScreenShot
        id={id}
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
        <Box component="td" display="flex" alignItems="center" width="25%">
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon htmlColor="#8C95A3" />
            ) : (
              <ExpandMoreIcon htmlColor="#8C95A3" />
            )}
          </IconButton>
          <Typography component="h3" className={classes.title}>
            {title}
          </Typography>
        </Box>
        <Box
          component="td"
          display="flex"
          width="25%"
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
        <Box component="td" display="flex" width="25%" justifyContent="center">
          <Typography component="h4" className={classes.cellText}>
            {ticker}
          </Typography>
        </Box>
        <Box component="td" display="flex" width="25%" justifyContent="center">
          <Typography component="h4" className={classes.cellText}>
            {timeframe}
          </Typography>
        </Box>
        <Box
          component="td"
          display="flex"
          width="25%"
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
              handleDuplicate={handleDuplicate}
              handleDelete={handleDelete}
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
              {title}
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
                    {t("strategyTable.asset")}:
                  </Box>{" "}
                  {owner}
                </Typography>
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
              handleClose={handleClose}
              handleDuplicate={handleDuplicate}
              handleDelete={handleDelete}
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
                position="relative"
                width="30%"
                borderRadius="10px"
                p={2}
                bgcolor="#FFF"
                className={classes.expandComponent}
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
                <img
                  src={image}
                  width="100%"
                  alt="Balance chart"
                  height="100%"
                />
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
            ml={!validated && "auto"}
          >
            <ProtectedComponent
              iconTop="-30px"
              iconRight="2px"
              iconSize="20"
              iconColor="grey"
            >
              <Box display="flex" alignItems="center" px={3}>
                <Switch
                  classes={{ root: classes.switch, track: classes.switchTrack }}
                  color="primary"
                  disabled={!validated}
                  checked={clientShared}
                  onChange={handleShare}
                />
                <Typography>{t("PublicAccess")}</Typography>
              </Box>
            </ProtectedComponent>
            <ProtectedComponent
              iconTop="-30px"
              iconRight="2px"
              iconSize="20"
              iconColor="grey"
            >
              <CustomButton
                href={`https://hook.integromat.com/8qep1c2hdt862m5x2jt6b1kikwjyxq96?id=${id}`}
                target="_blank"
                color="primary"
                variant="contained"
                disableElevation
              >
                {t("EnableNotifications")}
              </CustomButton>
            </ProtectedComponent>
            <CustomButton
              onClick={() => handleLoad("/builder")}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t("OpenBuilder")}
            </CustomButton>
            <CustomButton
              onClick={() => handleLoad("/validation")}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t("OpenValidator")}
            </CustomButton>
            <CustomButton
              onClick={handleDuplicate}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t("Duplicate")}
            </CustomButton>
            <ProtectedComponent
              iconTop="-30px"
              iconRight="2px"
              iconSize="20"
              iconColor="grey"
            >
              <CustomButton
                color="primary"
                variant="contained"
                disableElevation
                href={`${
                  process.env.REACT_APP_TRADEASY_WEBPAGE
                }wp-content/themes/Divi/autotrade/download-my-strategy.php?user_id=${localStorage.getItem(
                  "user_id"
                )}&strategy_id=${id}`}
              >
                {t("Download")}
              </CustomButton>
            </ProtectedComponent>
            <CustomButton
              className={classes.deleteButton}
              onClick={handleDelete}
              color="primary"
              variant="contained"
              disableElevation
            >
              {t("Delete")}
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
  title: PropTypes.string.isRequired, // Strategy title
  validated: PropTypes.bool.isRequired, // Bool to check if strategy is validated
  shared: PropTypes.bool.isRequired, // Bool to check if strategy is shared
  profit: PropTypes.number.isRequired, // Strategy profit
  risk: PropTypes.number.isRequired, // Strategy risk
  ticker: PropTypes.string.isRequired, // Strategy ticker
  timeframe: PropTypes.string.isRequired, // Strategy timeframe
  owner: PropTypes.string.isRequired, // Strategy creator
  shareDate: PropTypes.string.isRequired, // Date were strategy was shared
  image: PropTypes.string.isRequired, // Strategy balance image
  operations: PropTypes.object.isRequired, // Strategy operations
  currency: PropTypes.string.isRequired, // Strategy currency
  setRefrestStragety: PropTypes.func,
  refreshStrategy: PropTypes.bool,
};
