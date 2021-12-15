import React, {
  Fragment,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Box, makeStyles, Typography } from "@material-ui/core";
import "@fontsource/karla";
import theme from "lib/theme";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Lock } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  root: {},
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: "flex",
  },
}));

const ProtectedComponent = (props) => {
  const { children, isOpen = false, isValid = false, ...remains } = props;

  const [t] = useTranslation("freemium");

  const classes = useStyles();
  const isValidCount =
    localStorage.getItem("user_valid_count") > 0 ? true : false;
  const isUserValid = localStorage.getItem("type_user") != "F";

  // Modal
  const [open, setOpen] = React.useState(isOpen);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onHandleClick = (e) => {
    if ((!isValid && !isUserValid) || (isValid && !isValidCount)) {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new Event("mouseup"));
      handleOpen();
      return;
    } else if (remains.onTabClick) {
      remains.onTabClick(e, 0);
    } else if (remains.onItemClick) {
      remains.onItemClick(remains.itemValue);
      window.dispatchEvent(new Event("click"));
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: onHandleClick,
        onMouseDown: onHandleClick,
      })}
      {((!isValid && !isUserValid) || (isValid && !isValidCount)) && (
        <Box
          position="relative"
          width="100%"
          flex="0 0"
          zIndex="1"
          draggable="true"
        >
          <Box
            position="absolute"
            right={remains.iconRight}
            top={remains.iconTop}
          >
            <Lock
              style={{ fontSize: remains.iconSize, color: remains.iconColor }}
            />
          </Box>
        </Box>
      )}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <Box alignItems="center" justifyContent="center" display="flex">
                <Lock style={{ fontSize: 80, color: "grey" }} />
              </Box>
              <Box>
                <Typography id="transition-modal-title" variant="h4">
                  {t("action")}
                </Typography>
                <p id="transition-modal-description">
                  <Typography
                    variant="h5"
                    href={t("plans_link")}
                    target="_blank"
                    component="a"
                  >
                    {t("improve")}
                  </Typography>
                </p>
              </Box>
            </div>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

ProtectedComponent.propTypes = {
  children: PropTypes.any,
  isOpen: PropTypes.bool,
  isValid: PropTypes.bool,
};

export default ProtectedComponent;
