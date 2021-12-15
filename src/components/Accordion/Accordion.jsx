import React from "react";
import MUIAccordion from "@material-ui/core/Accordion";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: 0,
    },
  },
  expanded: {},
}));

const Accordion = (props) => {
  const classes = useStyles();
  return (
    <MUIAccordion
      square
      elevation={0}
      variant="outlined"
      classes={{ root: classes.root, expanded: classes.expanded }}
      {...props}
    ></MUIAccordion>
  );
};

export default Accordion;
