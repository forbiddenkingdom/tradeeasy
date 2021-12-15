import React from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";

import HelpIcon from "@material-ui/icons/HelpSharp";
import { useTranslation } from "react-i18next";
import PrimaryButton from "components/Button/PrimaryButton";

export default function SimplePopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [t] = useTranslation("dashboard");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <HelpIcon />
      </IconButton>
      <Popover
        elevation={0}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={2}
        >
          <Typography>
            <PrimaryButton
              href={process.env.REACT_APP_TRADEASY_HELP}
              target={"_blank"}
            >
              {t("help")}
            </PrimaryButton>
          </Typography>
        </Box>
      </Popover>
    </div>
  );
}
