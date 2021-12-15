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
import { Droppable } from "react-beautiful-dnd";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ElementBox from "components/Builder/ElementBox";
import { useDispatch } from "react-redux";
import {
  configureOpenRule,
  deleteRule,
  configureCloseRule,
} from "store/reducers/builder.reducer";
import { useTranslation } from "react-i18next";
import { changeValidationStatus } from "store/reducers/strategy.reducer";
import { Switch } from "@material-ui/core";
import PowerIcon from "@material-ui/icons/Power";
import PowerOffIcon from "@material-ui/icons/PowerOff";
import { activateRule } from "store/reducers/builder.reducer";

const useStyles = makeStyles({
  root: {
    textTransform: "none",
    color: "#555559",
    fontSize: "1rem",
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

Rule.propTypes = {
  id: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  triggerCount: PropTypes.number.isRequired,
  sameType: PropTypes.string,
  differentType: PropTypes.string,
  volume: PropTypes.string,
  type: PropTypes.string.isRequired,
  buys: PropTypes.string.isRequired,
  sells: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  readingType: PropTypes.string.isRequired,
  openVolType: PropTypes.string,
  porcentage: PropTypes.string,
  active: PropTypes.bool,
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
export default function Rule({
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
  active,
}) {
  const dispatch = useDispatch();
  const [t] = useTranslation("builder");
  const [expanded, setExpanded] = useState(); // State to control what panel is expanded
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

  const handleDeleteRule = () => {
    dispatch(deleteRule(id));
    dispatch(changeValidationStatus());
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleActivateRule = (event) => {
    const { checked } = event.target;
    const PAYLOAD = { ruleId: id, isActive: checked };
    dispatch(activateRule(PAYLOAD));
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
              onClose={handleSave}
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
                    {type} {t("rule")} {number}
                  </Typography>
                  <IconButton
                    disableFocusRipple
                    disableElevation
                    onClick={handleSave}
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
                    <Typography>{t("AllowSameType")}</Typography>
                    <Box ml={1}>
                      <Select
                        id="sameType"
                        name="sameType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setSameTypeState(e.target.value)}
                        value={sameTypeState}
                      >
                        <MenuItem value="0">{t("Disabled")}</MenuItem>
                        <MenuItem value="1">{t("Actived")}</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>{t("AllowSameTypeDesc")}</AccordionDetails>
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
                    <Typography>{t("AllowDifferentType")}</Typography>
                    <Box ml={1}>
                      <Select
                        id="differentType"
                        name="differentType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setDifferentTypeState(e.target.value)}
                        value={differentTypeState}
                      >
                        <MenuItem value="1">{t("Actived")}</MenuItem>
                        <MenuItem value="0">{t("Disabled")}</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {t("AllowDifferentTypeDef")}
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
                    <Typography>{t("VolumeType")}</Typography>
                    <Box ml={1}>
                      <Select
                        id="volumeType"
                        name="volumeType"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setVolumeType(e.target.value)}
                        value={volumeType}
                      >
                        <MenuItem value="0">{t("Fix")}</MenuItem>
                        <MenuItem value="1">{t("Variable")}</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>{t("VolumeTypeDef")}</AccordionDetails>
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
                    <Typography>{t("Volume")}</Typography>
                    <Box ml={1}>
                      <TextField
                        id="volume"
                        type="number"
                        defaultValue={volumeState}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        helperText={t("valueBetween")}
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
                          inputProps: { min: 0, max: 100, placeholder: 1 },
                        }}
                        error={volumeState < 0 || volumeState > 100}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {volumeType == 0 ? (
                      <Typography> {t("VolumeFixDef")}</Typography>
                    ) : (
                      <Typography>{t("VolumeVariableDef")}</Typography>
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
                    <Typography>{t("TypeOfReading")}</Typography>
                    <Box ml={1}>
                      <Select
                        id="readingType"
                        value={readingTypeState}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setReadingTypeState(e.target.value)}
                      >
                        <MenuItem value="1">{t("ClosseCandle")}</MenuItem>
                        <MenuItem value="0">{t("Tick")}</MenuItem>
                      </Select>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>{t("TypeOfReadingDef")}</AccordionDetails>
                </Accordion>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog
              open={open}
              onClose={handleSave}
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
                    {type} {t("rule")} {number}
                  </Typography>
                  <IconButton
                    disableFocusRipple
                    disableElevation
                    onClick={handleSave}
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
                      <Typography>{t("TypeOfReading")}</Typography>
                      <Box ml="10px">
                        <Select
                          id="readingType"
                          value={readingTypeState}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          onChange={(e) => setReadingTypeState(e.target.value)}
                        >
                          <MenuItem value="1">{t("ClosseCandle")}</MenuItem>
                          <MenuItem value="0">{t("Tick")}</MenuItem>
                        </Select>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box px={2} display="flex" flexDirection="column">
                      {t("TypeOfReadingDef")}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </DialogContent>
            </Dialog>
          )}

          <Box
            display="flex"
            flexDirection="column"
            p={2}
            style={{
              background: ruleStyle().bgcolor,
              opacity: active ? 1 : 0.5,
            }}
          >
            <Box display="flex" alignItems="center">
              <Chip
                label={ruleStyle().tag}
                style={{
                  backgroundColor: ruleStyle().color,
                  color: "white",
                }}
              />
              <Button
                endIcon={<DeleteIcon />}
                classes={{ root: classes.root, endIcon: classes.endIcon }}
                disableElevation
                onClick={handleDeleteRule}
              >
                {t("deleterule")}
              </Button>

              <Button
                endIcon={<SettingsIcon />}
                classes={{ root: classes.root, endIcon: classes.endIcon }}
                disableElevation
                onClick={handleClickOpen}
              >
                {t("settings")}
              </Button>
              {/*
              <Box>
                {triggerCount > 1 && (
                  <Alert variant="filled" severity="error">
                    {t("Warning2")}
                  </Alert>
                )}
                {triggerCount < 1 && elements.length > 0 && (
                  <Alert variant="filled" severity="error">
                    {t("Warning1")}
                  </Alert>
                )}
              </Box>
              */}
              <Box ml="auto" display="flex" alignItems="center">
                <Typography>{active ? t("activated") : t("disabled") }</Typography>
                <Switch
                  checked={active}
                  onChange={handleActivateRule}
                  color="primary"
                  icon={<PowerOffIcon />}
                  checkedIcon={<PowerIcon />}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              margin="10px 10px 0px 0px"
              overflow="auto"
              // width="1000px"
            >
              {elements.length === 0 && (
                <Typography variant="body1">{t("dndHint")}</Typography>
              )}
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
                    buys={buys}
                    sells={sells}
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
