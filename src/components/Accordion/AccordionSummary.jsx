import React from "react";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F7F7FA",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    color: "#85858C",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
    alignItems: "center",
  },
  expanded: {},
}));

const AccordionSummary = (props) => {
  const classes = useStyles();
  return (
    <MuiAccordionSummary
      classes={{
        root: classes.root,
        expanded: classes.expanded,
        content: classes.content,
      }}
      {...props}
    ></MuiAccordionSummary>
  );
};

export default AccordionSummary;
