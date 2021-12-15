import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#9DEAD7",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#0DCC9B",
  },
}))(LinearProgress);

const LinearProgressWithLabel = (props) => {
  const [t] = useTranslation("validation");
  return (
    <Box width="280px" color="white">
      <Box display="flex">
        <Box>{t("validationInProgress")}</Box>
        <Box marginLeft="auto">{Math.round(props.value)}%</Box>
      </Box>
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
};

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number,
};

export default LinearProgressWithLabel;
