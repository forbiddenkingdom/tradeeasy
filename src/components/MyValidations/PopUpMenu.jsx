import React from "react";
import PropTypes from "prop-types";
// Frameworks
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
// Material UI
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/styles";
// Custom imports

// Components
const StyledMenu = withStyles({
  paper: {
    borderRadius: "5px",
    backgroundColor: "#253E66",
  },
  list: {
    padding: 0,
    display: "flex",
    flexDirection: "column",
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
const StyledButton = withStyles({
  root: {
    color: "#FFF",
    textTransform: "none",
    padding: "0.75rem",
  },
})((props) => <Button disableElevation {...props} />);

export default function PopUpMenu({ id, anchor, handleClose, handleLoad }) {
  // Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation("myValidation");
  const [destination, setDestination] = React.useState("/builder");
  const [loading, setLoading] = React.useState("idle");
  // Handlers

  // Coinditional returns
  if (loading == "loaded") return <Redirect to={destination} />;
  // Main return
  return (
    <StyledMenu
      id="customized-menu"
      anchorEl={anchor}
      keepMounted
      open={Boolean(anchor)}
      onClose={handleClose}
      bgcolor="#253E66"
    >
      <StyledButton onClick={() => handleLoad("/builder")}>
        {t("RecoverStrategy")}
      </StyledButton>
    </StyledMenu>
  );
}
PopUpMenu.propTypes = {
  id: PropTypes.number.isRequired,
  anchor: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleLoad: PropTypes.func.isRequired,
};
