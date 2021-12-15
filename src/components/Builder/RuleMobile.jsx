import React, { useState } from "react";
import PropTypes from "prop-types";
import Accordion from "components/Accordion/Accordion";
import AccordionSummary from "components/Accordion/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import { Droppable } from "react-beautiful-dnd";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ElementBox from "components/Builder/ElementBox";
import { useDispatch } from "react-redux";
import {
  configureOpenRule,
  deleteRule,
  configureCloseRule,
} from "store/reducers/builder.reducer";
import { useTranslation } from "react-i18next";
import { changeValidationStatus } from "store/reducers/strategy.reducer";

const useStyles = makeStyles({
  root: {
    textTransform: "none",
    color: "#555559",
    fontSize: "0.8rem",
  },
  endIcon: {
    color: "#25AAE2",
  },
  dialogTitle: {
    fontSize: "1.5rem",
    textTransform: "none",
    color: "#555559",
  },
  dialogContent: {
    padding: "0px",
    display: "flex",
    flexDirection: "column",
  },
});

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

RuleMobile.propTypes = {
  id: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  triggerCount: PropTypes.number.isRequired,
  sameType: PropTypes.string,
  differentType: PropTypes.string,
  volume: PropTypes.number,
  type: PropTypes.string.isRequired,
  buys: PropTypes.string.isRequired,
  sells: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  readingType: PropTypes.string.isRequired,
  openVolType: PropTypes.string,
  porcentage: PropTypes.number,
};
/**
 *
 * @param {Object} props
 * @param {Number} props.id
 * @param {String} props.type
 * @param {Boolean} props.buys
 * @param {Boolean} props.sells
 * @param {Object[]} props.elements
 * @param {String} props.readingType
 */
export default function RuleMobile({
  id,
  number,
  type,
  sameType,
  differentType,
  openVolType,
  triggerCount,
  volume,
  porcentage,
  buys,
  sells,
  elements,
  readingType,
}) {
  const dispatch = useDispatch();
  const [t] = useTranslation("builder");
  const [expanded, setExpanded] = useState(); // State to control what panel is expanded
  const [anchorEl, setAnchorEl] = useState(null);
  const [sameTypeState, setSameTypeState] = useState(sameType);
  const [differentTypeState, setDifferentTypeState] = useState(differentType);
  const [volumeType, setVolumeType] = useState(openVolType);
  const [volumeState, setVolumeState] = useState(volume);
  const [porcentageState, setPorcentage] = useState(porcentage);
  const [readingTypeState, setReadingTypeState] = useState(readingType);
  /**
   * Handler to change expanded panel
   * @param {String} panel Used to decide wich panel will be expanded.
   * @returns
   */
  const handleExpand = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleRuleOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDeleteRule = () => {
    dispatch(deleteRule(id));
    dispatch(changeValidationStatus());
  };
  const handleRuleOptionsClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (type == "open") {
      dispatch(
        configureOpenRule({
          ruleId: id,
          sameType: sameTypeState,
          differentType: differentTypeState,
          volumeType: volumeType,
          volume: volumeState,
          porcentage: porcentageState,
          readingType: readingTypeState,
        })
      );
    } else {
      dispatch(
        configureCloseRule({ ruleId: id, readingType: readingTypeState })
      );
    }
    dispatch(changeValidationStatus());
    handleClose();
  };

  const classes = useStyles();
  const ruleStyle = () => {
    if (buys == true && sells == true) {
      return {
        tag: t("rules." + type + "Buy&Sell"),
        bgcolor:
          "linear-gradient(180deg, rgba(179, 103, 155, 0.1) 49%, rgba(227,227,229,1) 50%, rgba(251,251,253,1) 50%)",
        color: " rgba(179, 103, 155, 1)",
      };
    } else {
      if (buys == true) {
        return {
          tag: t("rules." + type + "Buy"),
          bgcolor:
            "linear-gradient(180deg, rgba(128,161,193,0.1) 49%, rgba(227,227,229,1) 50%, rgba(251,251,253,1) 50%)",
          color: "rgba(128,161,193,1)",
        };
      } else {
        return {
          tag: t("rules." + type + "Sell"),
          bgcolor:
            "linear-gradient(180deg, rgba(223, 146, 142, 0.1) 49%, rgba(227,227,229,1) 50%, rgba(251,251,253,1) 50%)",
          color: "rgba(223, 146, 142, 1)",
        };
      }
    }
  };
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Box {...provided.droppableProps} ref={provided.innerRef}>
          {type == "open" ? (
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography classes={{ root: classes.dialogTitle }}>
                    {type} Rule {number}
                  </Typography>
                  <IconButton
                    disableFocusRipple
                    disableElevation
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent className={classes.dialogContent}>
                <Accordion
                  expanded={expanded === "sameType"}
                  onChange={handleExpand("sameType")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Allow same type:</Typography>
                    <Box ml={1}>
                      <Select
                        id="sameType"
                        name="sameType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setSameTypeState(e.target.value)}
                        value={sameTypeState}
                      >
                        <MenuItem value="0">Disabled</MenuItem>
                        <MenuItem value="1">Actived</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    Choose this option if you want to allow opening orders of
                    the same type (open purchases if there are already purchases
                    and the other way around).
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "differentType"}
                  onChange={handleExpand("differentType")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Allow different type:</Typography>
                    <Box ml={1}>
                      <Select
                        id="differentType"
                        name="differentType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setDifferentTypeState(e.target.value)}
                        value={differentTypeState}
                      >
                        <MenuItem value="1">Actived</MenuItem>
                        <MenuItem value="0">Disabled</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    Choose this option if you want to allow opening orders of
                    the opposite type (open purchases if there are already sales
                    and the other way around).
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "volumeType"}
                  onChange={handleExpand("volumeType")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Volume Type:</Typography>
                    <Box ml={1}>
                      <Select
                        id="volumeType"
                        name="volumeType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setVolumeType(e.target.value)}
                        value={volumeType}
                      >
                        <MenuItem value="0">Fix</MenuItem>
                        <MenuItem value="1">Variable</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    Select between static volume or proportional to equity
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "volume"}
                  onChange={handleExpand("volume")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Volume:</Typography>
                    <Box ml={1}>
                      <TextField
                        id="volume"
                        type="number"
                        defaultValue={volumeState}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) =>
                          volumeType == 1
                            ? setVolumeState(e.target.value)
                            : setPorcentage(e.target.value)
                            ? setPorcentage(e.target.value)
                            : setVolumeState(e.target.value)
                        }
                        InputProps={{
                          endAdornment:
                            volumeType == 0 ? null : (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          inputProps: { min: 1, max: 100 },
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {volumeType == 0 ? (
                      <Typography>
                        {" "}
                        Define the volume for the orders of this rule.
                      </Typography>
                    ) : (
                      <Typography>
                        Choose the % of the account balance to destinate to the
                        margin of the order.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "readingType"}
                  onChange={handleExpand("readingType")}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Type of reading:</Typography>
                    <Box ml={1}>
                      <Select
                        id="readingType"
                        value={readingTypeState}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setReadingTypeState(e.target.value)}
                      >
                        <MenuItem value="1">Candle closure</MenuItem>
                        <MenuItem value="0">Tick closure</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    Choose the type of reading of the validation. Tick: at every
                    tick of the market. Candle close: each time that a candle
                    ends.
                  </AccordionDetails>
                </Accordion>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  disableElevation
                  onClick={handleSave}
                  style={{
                    textTransform: "none",
                    padding: "2px 0",
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography classes={{ root: classes.dialogTitle }}>
                    {type} Rule {number}
                  </Typography>
                  <IconButton
                    disableFocusRipple
                    disableElevation
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Box display="flex" alignItems="baseline">
                      <Typography>Type of reading</Typography>
                      <Box ml="10px">
                        <Select
                          id="readingType"
                          value={readingTypeState}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          onChange={(e) => setReadingTypeState(e.target.value)}
                        >
                          <MenuItem value="1">Candle closure</MenuItem>
                          <MenuItem value="0">Tick closure</MenuItem>
                        </Select>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box px={2} display="flex" flexDirection="column">
                      Choose the type of reading of the validation. Tick: at
                      every tick of the market. Candle close: each time that a
                      candle ends.
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  disableElevation
                  onClick={handleSave}
                  style={{
                    textTransform: "none",
                    padding: "2px 0",
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/* ************************ Item Display *************************** */}
          <Box
            display="flex"
            flexDirection="column"
            p={2}
            style={{
              background: ruleStyle().bgcolor,
            }}
          >
            <Box display="flex" alignItems="center">
              <Chip
                label={ruleStyle().tag}
                style={{
                  backgroundColor: ruleStyle().color,
                  color: "white",
                  fontSize: "0.8rem",
                }}
                deleteIcon={<MoreHorizIcon />}
                onDelete={handleRuleOptionsClick}
              />
              <StyledMenu
                id="close-rule-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleRuleOptionsClose}
              >
                <StyledMenuItem>
                  <CloseIcon /> Clear Rule Content
                </StyledMenuItem>
                <StyledMenuItem onClick={handleDeleteRule}>
                  <DeleteIcon />
                  Delete Rule
                </StyledMenuItem>
              </StyledMenu>

              <Button
                endIcon={<SettingsIcon />}
                classes={{ root: classes.root, endIcon: classes.endIcon }}
                disableElevation
                onClick={handleClickOpen}
              >
                Settings
              </Button>
              <Box>
                {triggerCount < 1 && (
                  <Alert variant="filled" severity="error">
                    Please, place 1 element as trigger.
                  </Alert>
                )}
                {triggerCount > 1 && (
                  <Alert variant="filled" severity="error">
                    Only 1 element is allowed to be trigger per rule.
                  </Alert>
                )}
              </Box>
            </Box>
            <Box
              display="flex"
              margin="10px 0px 0px 0px"
              overflow="auto"
              width="100%"
            >
              {elements.map((element) => {
                return (
                  <ElementBox
                    key={element.number}
                    id={element.id}
                    rule_id={id}
                    number={element.number}
                    title={element.name}
                    type={element.type}
                    image={element.image}
                    parameters={element.params}
                    ruleType={type}
                  />
                );
              })}
            </Box>
          </Box>
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}
