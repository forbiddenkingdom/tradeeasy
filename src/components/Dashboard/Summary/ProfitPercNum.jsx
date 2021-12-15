import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    color: "#11CC9A",
  },
});

ProfitPercNum.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
};

export default function ProfitPercNum(props) {
  const { text, size } = props;
  const classes = useStyles();
  return (
    <Typography className={classes.root} variant={size}>
      {text}
    </Typography>
  );
}
