import React, { useState } from "react";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import BrokenImageIcon from "@material-ui/icons/BrokenImage";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Accordion from "components/Accordion/Accordion";
import AccordionSummary from "components/Accordion/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { isNull } from "lodash";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import NativeSelect from "@material-ui/core/NativeSelect";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const styles = makeStyles({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  elementImage: {
    margin: "1rem",
    width: 60,
    height: 60,
  },
});

function useForceUpdate() {
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const ElementConfig = ({ title, image, parameters, buys, sells }) => {
  const classes = styles();
  const [t] = useTranslation(["elements", "parameters"]);
  const [expanded, setExpanded] = useState("");
  const handleExpand = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const forceUpdate = useForceUpdate();
  const handleParameterChange = (id, value) => {
    parameters[id].value = value;
    forceUpdate();
  };
  return (
    <>
      <DialogTitle disableTypography className={classes.header}>
        <Avatar variant="rounded" className={classes.elementImage} src={image}>
          <BrokenImageIcon />
        </Avatar>
        <Typography>{t("elements:name." + title)}</Typography>
      </DialogTitle>
      <Divider />
      <Box>
        <Box p={2}>
          <Typography variant="body1">{t("description." + title)}</Typography>
          <Button
            variant="contained"
            disableElevation
            color="secondary"
            href={t("elements:link." + title)}
            target="blank"
            endIcon={<ArrowForwardIcon />}
          >
            Read more
          </Button>
        </Box>
        <Box>
          {parameters.map((parameter, index) => {
            if (
              // Si el parametro no tiene padre
              isNull(parameter.parent) ||
              // Si el parametro tiene padre y el valor del parametro es el necesario para mostrarlo
              (isNull(parameter.parent) == false &&
                parameters.find((param) => param.id == parameter.parent)
                  .value == parameter.parentValue)
            )
              if (
                // Parametro compras coincide con el tipo de regla
                (!parameter.name.includes("BUYS_FOR") &&
                  !parameter.name.includes("SELLS_FOR")) ||
                (parameter.name.includes("BUYS_FOR") && buys === "1") ||
                (parameter.name.includes("SELLS_FOR") && sells === "1")
              ) {
                {
                  return (
                    <>
                      {parameter.name == "SHOOT_SIGNAL" ||
                      parameter.visible == "0" ? null : (
                        <Accordion
                          key={parameter.id}
                          expanded={expanded === "parameter" + parameter.id}
                          onChange={handleExpand("parameter" + parameter.id)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              {t("parameters:name." + parameter.name)}:{" "}
                            </Typography>
                            {parameter.type == "DESPLEGABLE" ? (
                              <Box ml="10px">
                                <NativeSelect
                                  id={index.toString()}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  value={parameter.value}
                                  onChange={(event) =>
                                    handleParameterChange(
                                      event.target.id,
                                      event.target.value
                                    )
                                  }
                                  parent={parameter.parent}
                                  parent_value={parameter.parentValue}
                                >
                                  {parameter.values
                                    .split(";")
                                    .map((value, index) => {
                                      return (
                                        <option key={index} value={index}>
                                          {value}
                                        </option>
                                      );
                                    })}
                                </NativeSelect>
                              </Box>
                            ) : parameter.type == "BOOL" ? (
                              <Checkbox
                                id={index.toString()}
                                color="primary"
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                                checked={parseInt(parameter.value)}
                                onChange={(e) =>
                                  handleParameterChange(
                                    e.target.id,
                                    e.target.checked ? "1" : "0"
                                  )
                                }
                              ></Checkbox>
                            ) : parameter.type == "STRING" ? (
                              <Box ml="10px">
                                <TextField
                                  id={index.toString()}
                                  error={!parameter.value}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  value={parameter.value}
                                  size="small"
                                  type="time"
                                  parent={parameter.parent}
                                  parent_value={parameter.parentValue}
                                  onChange={(event) =>
                                    handleParameterChange(
                                      event.target.id,
                                      event.target.value
                                    )
                                  }
                                ></TextField>
                              </Box>
                            ) : parameter.type == "DOUBLE" ? (
                              <Box ml="10px">
                                <TextField
                                  id={index.toString()}
                                  value={parameter.value}
                                  helperText="Numero decimal"
                                  size="small"
                                  type="number"
                                  inputProps={{
                                    step: "0.01",
                                    placeholder: parameter.defaultValue,
                                  }}
                                  defaultValue={parameter.value}
                                  error={!parameter.value}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  parent={parameter.parent}
                                  parent_value={parameter.parentValue}
                                  onChange={(event) =>
                                    handleParameterChange(
                                      event.target.id,
                                      event.target.value
                                    )
                                  }
                                ></TextField>
                              </Box>
                            ) : (
                              <Box ml="10px">
                                <TextField
                                  id={index.toString()}
                                  value={parameter.value}
                                  size="small"
                                  type="number"
                                  helperText="Numero entero"
                                  error={
                                    parameter.value % 1 != 0 || !parameter.value
                                  }
                                  inputProps={{
                                    placeholder: parameter.defaultValue,
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  parent={parameter.parent}
                                  parent_value={parameter.parentValue}
                                  onChange={(event) =>
                                    handleParameterChange(
                                      event.target.id,
                                      event.target.value
                                    )
                                  }
                                ></TextField>
                              </Box>
                            )}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              {t(`parameters:description.${parameter.name}`)}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </>
                  );
                }
              }
          })}
        </Box>
      </Box>
    </>
  );
};

ElementConfig.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  parameters: PropTypes.array.isRequired,
  buys: PropTypes.string.isRequired,
  sells: PropTypes.string.isRequired,
};
export default ElementConfig;
