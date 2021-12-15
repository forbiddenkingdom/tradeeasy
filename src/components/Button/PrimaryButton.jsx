import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import "@fontsource/karla";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 5,
    margin: "0px 0.25rem",
    textTransform: "none",
    fontFamily: "Karla",
    fontWeight: 400,
  },
}));

const PrimaryButton = (props) => {
  const classes = useStyles();
  return (
    <Button
      color="primary"
      className={classes.root}
      variant="contained"
      disableElevation
      {...props}
    ></Button>
  );
};

export default PrimaryButton;
