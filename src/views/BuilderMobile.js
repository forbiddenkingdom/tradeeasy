import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
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
import { Link } from "react-router-dom";

import SaveIcon from "assets/icons/SaveIcon";
import OpenIcon from "assets/icons/OpenIcon";
import UndoIcon from "assets/icons/UndoIcon";
import RedoIcon from "assets/icons/RedoIcon";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";

import emptyRules from "assets/img/empty_rules.png";

import RuleMobile from "components/Builder/RuleMobile";
import PrimaryButton from "components/Button/PrimaryButton";
import { Redirect } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import {
  addOpenRule,
  addCloseRule,
  addElement,
} from "store/reducers/builder.reducer";
import { changeTitle, changeSaveStatus } from "store/reducers/strategy.reducer";
import { useTranslation } from "react-i18next";

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
  Saveopenbutton: {
    position: "absolute",
    top: 17,
    left: 40,
    zIndex: 1101,
    display: "flex",
    flexDirection: "row",
    "& input": {
      width: 90,
    },
    "& h4": {
      marginRight: 5,
    },
  },
  SecondaryButton: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
    height: 30,
    width: 75,
  },
  Primarybutton: {
    width: "max-content",
    padding: 6,
  },
  SecondaryButtonAction: {
    border: "1px solid #25AAE2",
    borderRadius: 20,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
    height: 30,
    width: 30,
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
    minWidth: 50,
  },

  Cajon: {
    overflowY: "scroll",
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

BuilderMobile.propTypes = {
  drawerWidth: propTypes.number,
};

export default function BuilderMobile() {
  const [t] = useTranslation(["builder", "elements"]);
  const strategy = useSelector((state) => state.strategy);
  const scenario = useSelector((state) => state.builder);
  const dispatch = useDispatch();
  // Strategy title.
  const [title, setTitle] = useState(strategy.title);
  const [elements, setElements] = useState([]);
  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(`${url}elements`, {
        signal: abortController.signal,
      });
      if (!response.ok) throw new Error("Elements fetch finished with errors.");
      const data = await response.json();
      setElements(data);
    } catch (error) {
      console.error(error);
    }
    return () => {
      abortController.abort();
    };
  }, []);
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
  // Styles
  const classes = useStyles();
  const onDragEnd = async (result) => {
    if (
      !result.destination ||
      result.destination.droppableId == "elementsBox"
    ) {
      return;
    }
    const url = process.env.REACT_APP_TRADEASY_API;
    const ruleId = result.destination.droppableId;
    try {
      const response = await fetch(
        `${url}elements/${result.draggableId}/parameters`
      );
      if (!response.ok)
        throw new Error("Parameters fetch finished with errors.");
      const data = await response.json();
      var droppedElement;
      for (const group of elements) {
        for (const element of group.elements) {
          if (element.element_id == result.draggableId)
            droppedElement = element;
        }
      }
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
    setIsSaving(true);
    saveStrategy();
    setIsSaving(false);
  };
  const saveStrategy = async () => {
    const url = process.env.REACT_APP_TRADEASY_API;
    const open_rules = scenario.present.rules.filter(
      (rule) => rule.type == "open"
    );
    const close_rules = scenario.present.rules.filter(
      (rule) => rule.type == "close"
    );
    const body = {
      id: title != strategy.title ? 0 : strategy.id,
      title: title,
      user: localStorage.getItem("user_id"),
      open: open_rules,
      close: close_rules,
      timeframe: strategy.timeframe,
      asset: strategy.ticker,
    };
    try {
      const response = await fetch(`${url}strategies/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error("Strategy save fetch finished with errors.");
      const data = await response.json();
      dispatch(changeSaveStatus({ id: data.id, saveStatus: true }));
      dispatch(changeTitle(title));
    } catch (error) {
      console.error(error);
    }
  };
  const [openDefinition, setOpenDefinition] = useState(false);
  const [definition, setDefinition] = useState("");
  if (isValidating)
    return (
      <>
        <Redirect to={"/validation"}></Redirect>
      </>
    );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Dialog open={openDefinition} onClose={() => setOpenDefinition(false)}>
          <DialogTitle>Definition</DialogTitle>
          <Box p={2} dangerouslySetInnerHTML={{ __html: definition }}></Box>
        </Dialog>

        {/* ************************************** Top buttons ********************************** */}
        <Box className={classes.Saveopenbutton}>
          <Typography variant="h4">Builder</Typography>
          <TextField
            placeholder="Strategy name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Box display="flex">
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
              to="/Strategies"
            >
              {t("builder:open")}
            </Button>
          </Box>
        </Box>

        {/* ************************************** Bottom buttons ********************************** */}
        <Box
          display="flex"
          ml="auto"
          position="absolute"
          right="10px"
          bottom="10px"
        >
          <IconButton
            color="secondary"
            variant="contained"
            disabled={!scenario.past.length}
            onClick={() => dispatch(ActionCreators.undo())}
            className={classes.SecondaryButtonAction}
            style={{ padding: "0 10px" }}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            color="secondary"
            variant="contained"
            disabled={!scenario.future.length}
            onClick={() => dispatch(ActionCreators.redo())}
            className={classes.SecondaryButtonAction}
            style={{ padding: "0 10px" }}
          >
            <RedoIcon />
          </IconButton>
          <PrimaryButton
            disabled={scenario.present.rules.lenght <= 0 || isSaving}
            endIcon={<ArrowForwardIcon />}
            onClick={handleValidating}
            className={classes.Primarybutton}
          >
            <Typography variant="h6">{t("builder:goToValidation")}</Typography>
          </PrimaryButton>
        </Box>

        <Box
          component="main"
          display="flex"
          width="100%"
          height="100%"
          bgcolor="white"
        >
          {/* ************************************** Indicator List ********************************** */}
          <Box
            bgcolor="#EBEBF2"
            borderRadius="10px 10px 0px 0px"
            width="30%"
            className={classes.Cajon}
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
            <Droppable droppableId="elementsBox">
              {(provided) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {elements.map((group) => (
                    <>
                      <Box px={2} pt={1}>
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
                      >
                        {group.elements.map((element, index) => (
                          <Draggable
                            key={element.element_id}
                            draggableId={element.element_id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                className={classes.Element}
                                display="flex"
                                flexDirection="column"
                                my="5px"
                                mx="5px"
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
                                    process.env.PUBLIC_URL + element.image_url
                                  }
                                  style={{ width: "50px", height: "50px" }}
                                  variant="rounded"
                                >
                                  <BrokenImageIcon />
                                </Avatar>
                                <Typography
                                  variant="h6"
                                  style={{
                                    fontFamily: "Karla",
                                    textTransform: "none",
                                  }}
                                >
                                  {t(`elements:name.${element.element_name}`)}
                                </Typography>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                      </Box>
                    </>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>

          <Box display="flex" flexDirection="column" width="70%" height="100%">
            {/* ************************************** Add/Close buttons ********************************** */}
            <Box pb={2}>
              <PrimaryButton onClick={handleOpenRuleClick}>
                <Typography variant="h6">{t("addOpenRule")}</Typography>
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
                <Typography variant="h6">{t("addCloseRule")}</Typography>
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

            {/* ************************************** Main Builder ********************************** */}
            <Box
              bgcolor="#FBFBFD"
              width="100%"
              height="100%"
              display="flex"
              borderRadius="10px 0 0 0"
              style={{ overflowY: "scroll" }}
              className={scenario.present.rules.length ? null : classes.NoRules}
            >
              <Box
                display={scenario.present.rules.length ? "none" : "flex"}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <img src={emptyRules} width="80px" />
                <Typography
                  style={{
                    color: "#85858C",
                    fontWeight: 400,
                    padding: "0.5rem 0",
                  }}
                >
                  Create your first rule, to make your strategy
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
                      <RuleMobile
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
                      />
                    );
                  })}
                {scenario.present.rules
                  .filter((rule) => rule.type == "close") // Create a new array only with close rules.
                  .map((rule) => {
                    if (rule.type == "close") {
                      return (
                        <RuleMobile
                          key={rule.id.toString()}
                          id={rule.id.toString()}
                          number={rule.number}
                          triggerCount={rule.triggerCount}
                          type={rule.type}
                          buys={rule.closeBuys}
                          sells={rule.closeSells}
                          readingType={rule.readingType}
                          elements={rule.elements}
                        />
                      );
                    }
                  })}
              </Box>
            </Box>
          </Box>
        </Box>
      </DragDropContext>
    </>
  );
}
