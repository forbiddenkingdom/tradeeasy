import React from "react";
import PropTypes from "prop-types";
// Frameworks
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
// Store
import { loadRules } from "store/reducers/builder.reducer";
import { loadStrategy } from "store/reducers/strategy.reducer";
// Material UI
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/styles";
// Custom imports
import { loadSharedStrategy } from "lib/helpers";
import ProtectedComponent from "components/Button/ProtectedComponent";

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

export default function PopUpMenu({ id, anchor, handleClose }) {
  // Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation("strategies");
  const [destination, setDestination] = React.useState("/builder");
  const [loading, setLoading] = React.useState("idle");
  // Handlers
  const handleLoad = async (destination) => {
    const strategy = await loadSharedStrategy(id);
    if (strategy.hadErrors) return;
    dispatch(
      loadRules({
        openRules: JSON.parse(strategy.openScenario),
        closeRules: JSON.parse(strategy.closeScenario),
      })
    );
    dispatch(
      loadStrategy({
        id: "",
        title: strategy.strategyTitle,
        timeframe: strategy.timeframe,
        ticker: strategy.asset,
        balance: strategy.balance,
      })
    );
    setDestination(destination);
    setLoading("loaded");
  };
  // Conditional Returns
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
      <ProtectedComponent
        iconTop="-30px"
        iconRight="2px"
        iconSize="20"
        iconColor="grey"
        onItemClick={() => handleLoad("/builder")}
      >
        <StyledButton>{t("OpenBuilder")}</StyledButton>
      </ProtectedComponent>
      <ProtectedComponent
        iconTop="-30px"
        iconRight="2px"
        iconSize="20"
        iconColor="grey"
        onItemClick={() => handleLoad("/validation")}
      >
        <StyledButton>{t("OpenValidator")}</StyledButton>
      </ProtectedComponent>
    </StyledMenu>
  );
}
PopUpMenu.propTypes = {
  id: PropTypes.number.isRequired,
  anchor: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};
