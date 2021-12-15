import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "@material-ui/core/Typography";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core";
import theme from "lib/theme";
import { Link } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  Username: {
    fontWeight: 400,
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
  Userdownarrow: {
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

export default function UserZone() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [avatarimg, setavatarimg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [t, i18n] = useTranslation(["dashboard"]); 
  useEffect(async () => {
    setLoading(true);
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    try {
      const response = await fetch(`${url}users/${userId}`, {
        signal: abortController.signal,
      });
      if (!response.ok)
        throw new Error("Profile name fetch finished with errors.");
      const data = await response.json();
      setUsername(data.alias);
      setavatarimg(data.avatar_img);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        "There was an error fetching Profile info. Contact with support"
      );
    }
    return () => {
      abortController.abort();
    };
  }, []);
  const [open, setOpen] = React.useState(false);
  const url = `${process.env.REACT_APP_TRADEASY_WEBPAGE}?cerrar-sesion=true`;
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const onLogout = () => {
    localStorage.removeItem("user_id");
    location.reload();
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor="white"
      borderRadius={5}
      mx={1}
    >
      <Avatar
        variant="square"
        style={{ width: "40px", height: "40px", borderRadius: 10 }}
        src={avatarimg}
        alt={username}
      >
        {username[0]}
      </Avatar>
      <Box mx={1} display="flex" alignItems="center">
        <Typography variant="h6" noWrap className={classes.Username}>
          {isLoading ? <Skeleton width={50} /> : username}
        </Typography>

        <IconButton
          ref={anchorRef}
          color="primary"
          onClick={handleToggle}
          className={classes.Userdownarrow}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Box>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper elevation={0}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    component={Link}
                    onClick={handleClose}
                    to={"/profile"}
                  >
                    {t("profile")}
                  </MenuItem>
                  {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
                  <MenuItem onClick={onLogout}>{t("logout")}</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
