import React, { useState } from "react";
import PropTypes from "prop-types";
import "@fontsource/karla";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import ElementConfig from "./ElementConfig";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import MuiTab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch } from "react-redux";
import {
  deleteElement,
  modifyElementShootType,
} from "store/reducers/builder.reducer";

//Icons
import InfoIcon from "@material-ui/icons/Info";
import SettingsIcon from "@material-ui/icons/Settings";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import theme from "lib/theme";
import { changeValidationStatus } from "store/reducers/strategy.reducer";

// Tab to select Trigger || Filter
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

// Custom Styles
const styles = makeStyles({
  itemContainer: {
    borderRadius: 10,
    marginRight: "0.5rem",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: 105,
    },
  },
  title: {
    fontFamily: "Karla",
    color: "#FFFFFF",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "19px",
    marginRight: "10px",
    [theme.breakpoints.down("md")]: {
      fontSize: 13,
    },
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
    "& button": {
      padding: "1px 6px",
      fontSize: "0.7rem",
    },

    [theme.breakpoints.down("md")]: {},
  },
  buttons: {
    padding: 0,
  },

  elementIcon: {
    color: "#0E98E2",
    backgroundColor: "#253E66",
    width: 50,
    height: 50,
    margin: "0px 5px 0px 0px",
  },
  parameterTitle: {
    color: "#FFFFFF",
    fontFamily: "Karla",
    fontWeight: 400,
    textTransform: "none",
    lineHeight: "14px",
    fontSize: 14,
    [theme.breakpoints.down("md")]: {
      fontSize: 11,
      lineHeight: "10px",
    },
  },
  elementNumber: {
    color: "#FFFFFF",
    opacity: 0.2,
  },
});
/**
 * Renders a <ElementBox /> component
 * @param {Object} props
 * @param {Number} props.id - the id of the element. Must be unique
 * @param {String} props.title - the title of the element
 * @param {String} props.image - the element image.
 * @param {Number} props.type - the type of the element. It can be trigger (1) or fitler (0)
 * @param {String} props.ruleType - rule type. Can be open or close rule
 * @example
 * return (
 *   <ElementBox id={1} title="ADX" type={0} ruleType="close" />
 * )
 */

const ElementBox = ({
  id,
  number,
  rule_id,
  title = "Element title",
  ruleType = "open",
  image,
  parameters,
  buys,
  sells,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation(["elements", "parameters"]);
  const classes = styles(); // Load styles
  const [openDialog, setOpenDialog] = useState(false);
  const paramsPrint = parameters.slice(0, 9);
  const shootSignalPosition = parameters.findIndex(
    (parameter) => parameter.name == "SHOOT_SIGNAL"
  );

  const [selectedType, setSelectedType] = useState(
    parameters[shootSignalPosition]
      ? parameters[shootSignalPosition].value
      : undefined
  );
  const [disableBox, setDisableBox] = useState(
    !parameters[shootSignalPosition] ||
      parameters[shootSignalPosition].box_visible != "1"
  );

  const handleDeletElement = () => {
    dispatch(deleteElement({ ruleId: rule_id, elementNumber: number }));
    dispatch(changeValidationStatus());
  };

  const handleParameterChange = (value) => {
    const shootSignalPosition = parameters.findIndex(
      (parameter) => (parameter.name = "SHOOT_SIGNAL")
    );
    parameters[shootSignalPosition].value = value;

    dispatch(
      modifyElementShootType({
        ruleId: rule_id,
        shootTypeValue: parseInt(value),
      })
    );
    dispatch(changeValidationStatus());
  };

  const handleSelectedTypeChange = (event, newType) => {
    if (newType != selectedType) handleParameterChange(newType);
    setSelectedType(newType);
  };
  return (
    <>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <ElementConfig
          title={title}
          image={image}
          parameters={parameters}
          buys={buys}
          sells={sells}
        />
      </Dialog>
      <Box
        padding={1}
        id={id}
        bgcolor={ruleType == "open" ? "#D9AA36" : "#253E66"}
        className={classes.itemContainer}
      >

        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            variant="rounded"
            className={classes.elementIcon}
            src={image}
            alt={title}
          >
            <BrokenImageIcon />
          </Avatar>
          <Box width="100%">
            <Box display="flex" justifyContent="space-between">
              <Typography className={classes.title}>
                {t(`elements:name.${title}`)}
              </Typography>
              <IconButton
                onClick={() => setOpenDialog(!openDialog)}
                className={classes.buttons}
              >
                <SettingsIcon color="secondary" fontSize="small" />
              </IconButton>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Tabs
                value={selectedType}
                onChange={handleSelectedTypeChange}
                className={classes.typeSelector}
              >
                <Tab label="Filter" value="0" disabled={disableBox} />
                <Tab label="Trigger" value="1" disabled={disableBox} />
              </Tabs>

              <IconButton
                href={t("elements:link." + title)}
                target={"_blank"}
                className={classes.buttons}
              >
                <InfoIcon color="secondary" fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box my={1}>
            {paramsPrint.map((parameter, index) => {
              return (
                <Box key={parameter.id}>
                  {parameter.name == "SHOOT_SIGNAL" ||
                  parameter.box_visible == "0" ? null : index == 9 ? null : (
                    <Typography className={classes.parameterTitle}>
                      {t(`parameters:name.${parameter.name}`)}:{" "}
                      {parameter.type == "DESPLEGABLE"
                        ? parameter.values.split(";")[parameter.value]
                        : parameter.value}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
          <IconButton onClick={handleDeletElement} className={classes.buttons}>
            <DeleteIcon color="secondary" fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

// Prop validation
ElementBox.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  number: PropTypes.number.isRequired,
  rule_id: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  parameters: PropTypes.array.isRequired,
  ruleType: PropTypes.string.isRequired,
  buys: PropTypes.string.isRequired, // Puede ser 1 o 0
  sells: PropTypes.string.isRequired, // Puede ser 1 o 0
};

export default ElementBox;
