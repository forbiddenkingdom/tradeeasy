import React, { useEffect, useState, Fragment } from "react";
import propTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Droppable } from "react-beautiful-dnd";
import { Link, NavLink } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import SaveIcon from "assets/icons/SaveIcon";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import OpenIcon from "assets/icons/OpenIcon";
import UndoIcon from "assets/icons/UndoIcon";
import RedoIcon from "assets/icons/RedoIcon";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import AddIcon from "@material-ui/icons/Add";
import emptyRules from "assets/img/empty_rules.png";

import Rule from "components/Builder/Rule";
import PrimaryButton from "components/Button/PrimaryButton";
import { Redirect } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import {
  addOpenRule,
  addCloseRule,
  addElement,
  resetBuilder,
} from "store/reducers/builder.reducer";

import {
  changeTitle,
  changeSaveStatus,
  changeTicker,
  changeTimeframe,
  reset,
} from "store/reducers/strategy.reducer";
import { useTranslation } from "react-i18next";
import ProtectedComponent from "components/Button/ProtectedComponent";
import LoadingShow from "components/common/LoadingShow";

const useStyles = makeStyles((theme) => ({
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
      // marginLeft: 70,
      left: 0,
    },
    zIndex: 0,
  },

  errorsReadMore: {
    padding: 5,
    margin: "0px -5px 0px 0px",
    minHeight: 0,
    backgroundColor: "#E3170A",
    borderRadius: 5,
  },
  SecondaryButton: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
  },
  PrimaryButton: {
    borderRadius: 5,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
  },
  Indicator: {
    backgroundColor: "#253E66",
    width: "50%",
  },
  Tab: {
    color: "#253E66",
    fontFamily: "Karla",
    textTransform: "none",
    width: "50%",
  },
  Element: {
    textAlign: "center",
    flex: " 0 0 25%",
    width: "60px",
    fontSize: "12px",
  },

  NoRules: {
    justifyContent: "center",
    alignItems: "center",
  },
  ElementGroupTitle: {
    textTransform: "none",
    color: "#55555",
    fontWeight: 600,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #E3E3E5",
  },
  list: {
    padding: 0,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles({
  root: {
    fontFamily: "Karla",
    color: "#25AAE2",
    borderWidth: "1px 0",
    borderStyle: "solid",
    borderColor: "#E3E3E5",
    padding: "0.75rem",
  },
})((props) => <MenuItem {...props} />);

Builder.propTypes = {
  drawerWidth: propTypes.number,
};

export default function Builder() {
  const [t, i18n] = useTranslation([
    "builder",
    "elements",
    "timeframes",
    "errors",
  ]);
  const [success, setSuccess] = useState(false);
  const handleSuccessClose = () => setSuccess(false);
  const [error, setError] = useState(false);
  const handleErrorClose = () => setError(false);
  const strategy = useSelector((state) => state.strategy);
  const scenario = useSelector((state) => state.builder);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(strategy.title);
  const handleTitleEdit = (title) => {
    setTitle(title);
    if (!title) return setMissingTitle(true);
    setMissingTitle(false);
  };
  const [elements, setElements] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [timeframes, setAllTimeframes] = useState([]);
  const [freeAvailables, setFreeAvailables] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    const abortController = new AbortController();
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const responseElements = await fetch(`${API_URL}elements`, {
        signal: abortController.signal,
      });
      const responseTickers = await fetch(`${API_URL}tickers/`, {
        signal: abortController.signal,
      });
      const responseTimeframes = await fetch(`${API_URL}timeframes/`, {
        signal: abortController.signal,
      });
      const responseFreeAvailables = await fetch(`${API_URL}FreeAvaliable`, {
        signal: abortController.signal,
      });

      if (!responseElements.ok)
        throw new Error("Elements fetch finished with errors.");
      if (!responseTickers.ok)
        throw new Error("Tickers fetch finished with errors.");
      if (!responseTimeframes.ok)
        throw new Error("Timeframes fetch finished with errors.");
      if (!responseFreeAvailables.ok)
        throw new Error("FreeAvailables fetch finished with errors.");
      const dataElements = await responseElements.json();
      const dataTickers = await responseTickers.json();
      const dataTimeframes = await responseTimeframes.json();
      const dataFreeAvailables = await responseFreeAvailables.json();

      setElements(dataElements);
      setTickers(dataTickers);
      setAllTimeframes(dataTimeframes);
      setFreeAvailables(dataFreeAvailables);
      setValidationValues(dataTickers[0].id, dataTimeframes[0].id);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
    return () => {
      abortController.abort();
    };
  }, []);
  const setValidationValues = (ticker, timeframe) => {
    strategy.ticker ? null : dispatch(changeTicker(ticker));
    strategy.timeframe ? null : dispatch(changeTimeframe(timeframe));
  };
  const handleAddRule = (action) => {
    dispatch(action);
    setOpenAnchorEl(null);
    setCloseAnchorEl(null);
  };
  // OpenRule Menu State
  const [openAnchorEl, setOpenAnchorEl] = useState(null);
  const handleOpenRuleClick = (event) => {
    setOpenAnchorEl(event.currentTarget);
  };
  const handleOpenRuleClose = () => {
    setOpenAnchorEl(null);
  };
  // Close Menu State
  const [closeAnchorEl, setCloseAnchorEl] = useState(null);
  const handleCloseRuleClick = (event) => {
    setCloseAnchorEl(event.currentTarget);
  };
  const handleCloseRuleClose = () => {
    setCloseAnchorEl(null);
  };
  const classes = useStyles(); // Styles
  const onDragEnd = async (result) => {
    if (
      !result.destination ||
      result.destination.droppableId == "elementsBox"
    ) {
      // If the drop ends on an undefined location or not in the Elements drawer, don't do nothing.
      return;
    }
    const url = process.env.REACT_APP_TRADEASY_API;
    const ruleId = result.destination.droppableId; //  Get the id from the dropped container.
    try {
      // Get element parametersm from API
      const response = await fetch(
        `${url}elements/${result.draggableId}/parameters?lang=${i18n.language}`
      );
      if (!response.ok)
        throw new Error("Parameters fetch finished with errors.");
      const data = await response.json();
      var droppedElement;
      // Search the dropped element information and store in a variable.
      for (const group of elements) {
        for (const element of group.elements) {
          if (element.element_id == result.draggableId)
            droppedElement = element;
        }
      }
      // Dispatch redux action to update state.
      dispatch(
        addElement({
          ruleId: ruleId,
          element: droppedElement,
          parameters: data,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  const [isValidating, setIsValidating] = useState(false);
  const handleValidating = async () => {
    setIsSaving(true);
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    const open_rules = scenario.present.rules.filter(
      (rule) => rule.type == "open"
    );
    const close_rules = scenario.present.rules.filter(
      (rule) => rule.type == "close"
    );
    const body = {
      id: strategy.id,
      origin: "M",
      open: open_rules,
      close: close_rules,
    };
    try {
      const response = await fetch(`${url}session/${userId}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error("Session update fetch finished with errors.");
      dispatch(changeTitle(title));
      setIsValidating(true);
    } catch (error) {
      console.error(error);
    }
    setIsSaving(false);
  };
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    if (!title) return handleErrorSave();
    saveStrategy();
    setIsSaving(false);
  };
  const [missingTitle, setMissingTitle] = useState(false);
  const handleErrorSave = () => {
    setError(true);
    setIsSaving(false);
    setMissingTitle(true);
  };
  const saveStrategy = async () => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const OPEN_RULES = scenario.present.rules.filter(
      (rule) => rule.type == "open"
    );
    const CLOSE_RULES = scenario.present.rules.filter(
      (rule) => rule.type == "close"
    );
    const body = {
      id: title != strategy.title ? 0 : strategy.id,
      title: title,
      user: localStorage.getItem("user_id"),
      open: OPEN_RULES,
      close: CLOSE_RULES,
      timeframe: strategy.timeframe,
      asset: strategy.ticker,
      startDate: strategy.startDate,
      endDate: strategy.endDate,
      balance: strategy.balance,
      currency: strategy.currency,
      gain: ((strategy.gain / strategy.balance) * 100).toFixed(2),
      profit: strategy.relativeRunup,
      risk: strategy.relativeDrawdown,
      trades_win: strategy.tradesWon,
      trades_loss: strategy.tradesLost,
      success_rate: strategy.successRate,
      gains_only: strategy.gainsOnly,
      loses_only: strategy.losesOnly,
      best_gain: strategy.bestGain,
      worst_loss: strategy.worstLoss,
      gain_loss_rate: strategy.gainLossRate,
      drawdown: strategy.drawdown,
      relativeDrawdown: strategy.relativeDrawdown,
      runup: strategy.runup,
      relativeRunup: strategy.relativeRunup,
      validated: strategy.isValidated,
      image: strategy.image,
    };
    try {
      const response = await fetch(`${API_URL}strategies/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error("Strategy save fetch finished with errors.");
      const data = await response.json();
      dispatch(changeSaveStatus({ id: data.id, saveStatus: true }));
      dispatch(changeTitle(title));
      setSuccess(true);
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };
  const [disableValidation, setDisableValidation] = useState(false);
  const [errors, setErrors] = useState([]);
  const [openErrors, setOpenErrors] = useState(false);
  // Handle opening errors modal
  const handleOpenErrors = () => {
    setOpenErrors(true);
  };
  // Handle closing errors modal
  const handleCloseErrors = () => {
    setOpenErrors(false);
  };
  function handleResetBuilder() {
    dispatch(resetBuilder());
    dispatch(reset());
  }
  // Effect to check if user can go to validate, executed every time he modifies the scenario.
  React.useEffect(() => {
    let hasErrors = false;
    const errors = { scenario: [], rules: [] };
    const openRules = scenario.present.rules
      .filter((rule) => rule.type == "open")
      .filter((rule) => rule.active == "1");

    const closeRules = scenario.present.rules
      .filter((rule) => rule.type == "close")
      .filter((rule) => rule.active == "1");

    // No open rules in the scenario
    if (openRules.length <= 0) {
      errors.scenario.push("noOpenRules");
      hasErrors = true;
    }

    // No close rules in the scenario
    if (closeRules.length <= 0) {
      errors.scenario.push("noCloseRules");
      hasErrors = true;
    }

    // Search errors, iterating with every rule.
    scenario.present.rules
      .filter((rule) => rule.active == "1")
      .map((rule) => {
        let ruleErrors = [];
        if (rule.elements <= 0) {
          ruleErrors.push("noElements");
          hasErrors = true;
        }
        if (rule.triggerCount < 1) {
          ruleErrors.push("noTrigger");
          hasErrors = true;
        }
        if (rule.triggerCount > 1) {
          ruleErrors.push("maxTrigger");
          hasErrors = true;
        }
        if (ruleErrors.length)
          errors.rules.push({ id: rule.number, errors: ruleErrors });
      });

    setErrors(errors);
    setDisableValidation(hasErrors);
  }, [scenario, scenario.present]);

  // Conditional returns
  if (isValidating)
    return (
      <>
        <Redirect to={"/validation"}></Redirect>
      </>
    );

  const onChangeTicker = (val) => {
    dispatch(changeTicker(val));
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

  const UrlPath = window.location.pathname.split("/")[1];
  let isDashboard = UrlPath == "dashboard" ? true : false;
  const isUserFree = localStorage.getItem("type_user") == "F";

  return (
    <Box position="relative" height="100%" width="100%">
      {isLoading ? (
        <LoadingShow />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <AppBar
            position="absolute"
            elevation={0}
            className={isDashboard ? classes.AppBar : classes.AppBarClose}
          >
            <Toolbar>
              <Box
                color="black"
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
                width="30ch"
                p="8px"
              >
                <Typography> {t("builder:StrategyName")}</Typography>
                <TextField
                  placeholder={t("builder:EnterName")}
                  error={missingTitle}
                  fullWidth
                  value={title}
                  onChange={(e) => handleTitleEdit(e.target.value)}
                />
              </Box>
              <Box
                color="black"
                width="22ch"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                p="8px"
              >
                <Typography>{t("builder:Ticker")}</Typography>
                <TextField
                  select
                  value={tickers.length ? strategy.ticker : ""}
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="ticker"
                  onChange={(e) => {
                    onChangeTicker(e.target.value);
                    console.log("kjs mimul");
                  }}
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
                        key={ticker.id}
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
              <Box
                color="black"
                width="22ch"
                p="8px"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Typography>{t("builder:Timeframe")}</Typography>
                <TextField
                  select
                  value={timeframes.length ? strategy.timeframe : ""}
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => onChangeTimeframe(e.target.value)}
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
                        component={CustomProtecter}
                      >
                        {t("timeframes:" + timeframe.name)}
                      </MenuItem>
                    ) : (
                      <MenuItem value={timeframe.id} key={timeframe.id}>
                        {t("timeframes:" + timeframe.name)}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Box>
              <Box display="flex" flexDirection="row" width="100%">
                <Box display="flex" mx={2}>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    disabled={isSaving}
                    onClick={handleSave}
                    className={classes.SecondaryButton}
                    startIcon={<SaveIcon />}
                  >
                    {t("builder:save")}
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    className={classes.SecondaryButton}
                    startIcon={<OpenIcon />}
                    component={Link}
                    to="/strategies"
                  >
                    {t("builder:open")}
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    className={classes.SecondaryButton}
                    startIcon={<AddIcon />}
                    onClick={handleResetBuilder}
                  >
                    {t("builder:createNew")}
                  </Button>
                </Box>
                <Box display="flex" ml="auto">
                  <IconButton
                    color="secondary"
                    variant="contained"
                    disabled={!scenario.past.length}
                    onClick={() => dispatch(ActionCreators.undo())}
                    className={classes.SecondaryButton}
                    style={{ padding: "0 10px" }}
                  >
                    <UndoIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    variant="contained"
                    disabled={!scenario.future.length}
                    onClick={() => dispatch(ActionCreators.redo())}
                    className={classes.SecondaryButton}
                    style={{ padding: "0 10px" }}
                  >
                    <RedoIcon />
                  </IconButton>
                  {disableValidation && (
                    <>
                      <IconButton
                        className={classes.errorsReadMore}
                        onClick={handleOpenErrors}
                        size="medium"
                      >
                        <ErrorOutlineIcon htmlColor="white" />
                      </IconButton>
                      <Dialog open={openErrors} onClose={handleCloseErrors}>
                        <Box
                          component={Typography}
                          display="flex"
                          alignItems="center"
                          variant="h3"
                          p={1}
                        >
                          <ErrorOutlineIcon fontSize="large" />
                          {t("builder:errorsFound")}
                        </Box>
                        <DialogContent>
                          <Typography variant="h4">
                            {t("builder:builderErrors")}
                          </Typography>
                          <ul>
                            {errors.scenario.map((error, index) => {
                              return (
                                <li key={index}>
                                  <Typography>
                                    {t("errors:" + error)}
                                  </Typography>
                                </li>
                              );
                            })}
                          </ul>
                          <Typography variant="h4">
                            {t("builder:ruleErrors")}
                          </Typography>
                          <ul>
                            {errors.rules.map((rule, index) => {
                              return (
                                <>
                                  <li>
                                    {t("builder:ruleNum")} {rule.id}:{" "}
                                  </li>
                                  <ul>
                                    {rule.errors.map((error, index) => {
                                      return (
                                        <li key={index}>
                                          <Typography>
                                            {t("errors:" + error)}
                                          </Typography>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              );
                            })}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  <PrimaryButton
                    disabled={disableValidation}
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleValidating}
                  >
                    {t("builder:goToValidation")}
                  </PrimaryButton>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          <Box
            component="main"
            display="flex"
            width="100%"
            height="100%"
            bgcolor="white"
            pt={11}
          >
            {/* TODO: Elements drawer */}
            <Box
              bgcolor="#EBEBF2"
              mx={3}
              borderRadius="10px 10px 0px 0px"
              width="30%"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Tabs value="simple" classes={{ indicator: classes.Indicator }}>
                <Tab
                  label={t("simpleMode")}
                  value="simple"
                  className={classes.Tab}
                />
                <Tab
                  label={t("expertMode")}
                  value="expert"
                  className={classes.Tab}
                  disabled
                />
              </Tabs>
              <Droppable droppableId="elementsBox" isDropDisabled={true}>
                {(provided) => (
                  <Box
                    display="flex"
                    height="100%"
                    overflow="auto"
                    flexDirection="column"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {elements.map((group, key) => (
                      <Fragment key={key}>
                        <Box px={4} pt={2}>
                          <Typography
                            className={classes.ElementGroupTitle}
                            key={group.id}
                          >
                            {t(`elements:group.${group.name}`)}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          justifyContent="center"
                          position="relative"
                        >
                          {group.elements.map((element, index) => (
                            <Draggable
                              key={element.element_id}
                              draggableId={element.element_id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <>
                                  {freeAvailables.find(
                                    (avail) =>
                                      avail.table_id == "ELEMENTS" &&
                                      avail.id == element.element_id
                                  ) ? (
                                    <ProtectedComponent
                                      iconTop="20px"
                                      iconRight="7px"
                                      iconSize="20"
                                      iconColor="white"
                                    >
                                      <Box
                                        className={classes.Element}
                                        display="flex"
                                        flexDirection="column"
                                        my="20px"
                                        mx="10px"
                                        alignItems="center"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                      >
                                        <Avatar
                                          alt={t(
                                            `elements:name.${element.element_name}`
                                          )}
                                          src={
                                            process.env.PUBLIC_URL +
                                            element.image_url
                                          }
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                          }}
                                          variant="rounded"
                                        >
                                          <BrokenImageIcon />
                                        </Avatar>
                                        <Typography
                                          variant="body2"
                                          style={{
                                            fontFamily: "Karla",
                                            textTransform: "none",
                                          }}
                                        >
                                          {t(
                                            `elements:name.${element.element_name}`
                                          )}
                                        </Typography>
                                      </Box>
                                    </ProtectedComponent>
                                  ) : (
                                    <Box
                                      className={classes.Element}
                                      display="flex"
                                      flexDirection="column"
                                      my="20px"
                                      mx="10px"
                                      alignItems="center"
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                    >
                                      <Avatar
                                        alt={t(
                                          `elements:name.${element.element_name}`
                                        )}
                                        src={
                                          process.env.PUBLIC_URL +
                                          element.image_url
                                        }
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                        }}
                                        variant="rounded"
                                      >
                                        <BrokenImageIcon />
                                      </Avatar>
                                      <Typography
                                        variant="body2"
                                        style={{
                                          fontFamily: "Karla",
                                          textTransform: "none",
                                        }}
                                      >
                                        {t(
                                          `elements:name.${element.element_name}`
                                        )}
                                      </Typography>
                                    </Box>
                                  )}
                                </>
                              )}
                            </Draggable>
                          ))}
                        </Box>
                      </Fragment>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              height="100%"
            >
              {/* TODO: Add rules bar */}
              <Box pb={2} display="flex" width="100%">
                <Box display="flex" width="50%">
                  <PrimaryButton onClick={handleOpenRuleClick}>
                    {t("addOpenRule")}
                  </PrimaryButton>
                  <StyledMenu
                    id="open-rule-menu"
                    anchorEl={openAnchorEl}
                    keepMounted
                    open={Boolean(openAnchorEl)}
                    onClose={handleOpenRuleClose}
                  >
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addOpenRule({ buys: "1", sells: "0" }))
                        }
                      >
                        {t("openBuys")}
                      </StyledMenuItem>
                    </div>
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addOpenRule({ buys: "0", sells: "1" }))
                        }
                      >
                        {t("openSells")}
                      </StyledMenuItem>
                    </div>
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addOpenRule({ buys: "1", sells: "1" }))
                        }
                      >
                        {t("openBuyAndSell")}
                      </StyledMenuItem>
                    </div>
                  </StyledMenu>

                  <PrimaryButton onClick={handleCloseRuleClick}>
                    {t("addCloseRule")}
                  </PrimaryButton>

                  <StyledMenu
                    id="close-rule-menu"
                    anchorEl={closeAnchorEl}
                    keepMounted
                    open={Boolean(closeAnchorEl)}
                    onClose={handleCloseRuleClose}
                  >
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addCloseRule({ buys: "1", sells: "0" }))
                        }
                      >
                        {t("closeBuys")}
                      </StyledMenuItem>
                    </div>
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addCloseRule({ buys: "0", sells: "1" }))
                        }
                      >
                        {t("closeSells")}
                      </StyledMenuItem>
                    </div>
                    <div>
                      <StyledMenuItem
                        onClick={() =>
                          handleAddRule(addCloseRule({ buys: "1", sells: "1" }))
                        }
                      >
                        {t("closeBuyAndSell")}
                      </StyledMenuItem>
                    </div>
                  </StyledMenu>
                </Box>
              </Box>
              {/* TODO: Main builder screen */}

              <Box
                bgcolor="#FBFBFD"
                width="100%"
                height="100%"
                display="flex"
                borderRadius="10px 0 0 0"
                style={{ overflowY: "scroll" }}
                className={
                  scenario.present.rules.length ? null : classes.NoRules
                }
              >
                <Box
                  display={scenario.present.rules.length ? "none" : "flex"}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <img src={emptyRules} width="180px" />
                  <Typography
                    style={{
                      color: "#85858C",
                      fontWeight: 400,
                      padding: "0.5rem 0",
                    }}
                  >
                    {t("builder:create")}
                  </Typography>
                </Box>
                {/* Rules Box */}
                <Box
                  display={scenario.present.rules.length ? "flex" : "none"}
                  flexDirection="column"
                  width="100%"
                >
                  {scenario.present.rules
                    .filter((rule) => rule.type == "open") // Create a new array only with open rules.
                    .map((rule) => {
                      return (
                        <Rule
                          key={rule.id.toString()}
                          id={rule.id.toString()}
                          sameType={rule.allowSameType}
                          triggerCount={rule.triggerCount}
                          openVolType={rule.openVolType}
                          differentType={rule.allowDifferentType}
                          volume={rule.volume}
                          porcentage={rule.porcentage}
                          number={rule.number}
                          type={rule.type}
                          buys={rule.openBuys}
                          sells={rule.openSells}
                          readingType={rule.readingType}
                          elements={rule.elements}
                          active={rule.active}
                        />
                      );
                    })}
                  {scenario.present.rules
                    .filter((rule) => rule.type == "close") // Create a new array only with close rules.
                    .map((rule) => {
                      if (rule.type == "close") {
                        return (
                          <Rule
                            key={rule.id.toString()}
                            id={rule.id.toString()}
                            number={rule.number}
                            triggerCount={rule.triggerCount}
                            type={rule.type}
                            buys={rule.closeBuys}
                            sells={rule.closeSells}
                            readingType={rule.readingType}
                            elements={rule.elements}
                            active={rule.active}
                          />
                        );
                      }
                    })}
                </Box>
              </Box>
            </Box>
          </Box>

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
              {t("builder:savedSuccesfully")}
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
              {t("builder:errorSaving")}
            </Alert>
          </Snackbar>
        </DragDropContext>
      )}
    </Box>
  );
}
