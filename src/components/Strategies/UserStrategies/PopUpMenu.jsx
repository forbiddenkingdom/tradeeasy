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
import { loadUserStrategy } from "lib/helpers";
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

export default function PopUpMenu({
  id,
  anchor,
  handleClose,
  handleDuplicate,
  handleDelete,
}) {
  // Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation("strategies");
  const [destination, setDestination] = React.useState("/builder");
  const [loading, setLoading] = React.useState("idle");
  // Handlers
  const handleLoad = async (destination) => {
    const strategy = await loadUserStrategy(id);
    if (strategy.hadErrors) return;
    dispatch(
      loadRules({
        openRules: JSON.parse(strategy.openScenario),
        closeRules: JSON.parse(strategy.closeScenario),
      })
    );
    await dispatch(
      loadStrategy({
        id: strategy.strategyId,
        title: strategy.strategyTitle,
        timeframe: strategy.timeframe,
        ticker: strategy.asset,
        balance: strategy.balance,
      })
    );
    setDestination(destination);
    setLoading("loaded");
  };
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
      <ProtectedComponent
        iconTop="-30px"
        iconRight="2px"
        iconSize="20"
        iconColor="grey"
      >
        <StyledButton
          href={`https://hook.integromat.com/8qep1c2hdt862m5x2jt6b1kikwjyxq96?id=${id}`}
          target="_blank"
        >
          {t("EnableNotifications")}
        </StyledButton>
      </ProtectedComponent>
      <StyledButton onClick={() => handleLoad("/builder")}>
        {t("OpenBuilder")}
      </StyledButton>
      <StyledButton onClick={() => handleLoad("/validation")}>
        {t("OpenValidator")}
      </StyledButton>
      <StyledButton onClick={handleDuplicate}>{t("Duplicate")}</StyledButton>
      <StyledButton onClick={handleDelete}>{t("Delete")}</StyledButton>
    </StyledMenu>
  );
}
PopUpMenu.propTypes = {
  id: PropTypes.number.isRequired,
  anchor: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleDuplicate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
