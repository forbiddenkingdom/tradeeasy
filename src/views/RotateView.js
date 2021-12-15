import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles, Typography } from "@material-ui/core";
import rotate from "assets/img/rotate.png";
import { useTranslation } from "react-i18next";
import theme from "lib/theme";
import propTypes from "prop-types";

const useStyles = makeStyles({
  appBarTitleBoard: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
});

RotateView.propTypes = {
  title: propTypes.string,
};

export default function RotateView(props) {
  const { title } = props;

  const [t] = useTranslation("global");
  const classes = useStyles();

  return (
    <Box width="100%" height="100%">
      <Typography variant="h3" noWrap className={classes.appBarTitleBoard}>
        {t(title)}
      </Typography>
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <img src={rotate} width="150" />
        <Typography variant="h4">Rotate to view full chart</Typography>
      </Box>
    </Box>
  );
}
