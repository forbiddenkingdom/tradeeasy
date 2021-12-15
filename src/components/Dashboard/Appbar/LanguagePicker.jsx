import React from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Box from "@material-ui/core/Box";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import moment from "moment";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Spanish from "assets/icons/i18n/Spanish";
import British from "assets/icons/i18n/British";

const languages = {
  es: <Spanish />,
  en: <British />,
};

export default function UserZone() {
  // eslint-disable-next-line no-unused-vars
  const [t, i18n] = useTranslation("global");
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(i18next.language);

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
    // If user press tab, close the menu.
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  const handleMenuItemClick = (event, key) => {
    setSelectedIndex(key);
    i18n.changeLanguage(key);
    moment.locale(key);
    setOpen(false);
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
      <Box display="flex" alignItems="center">
        {languages[selectedIndex]}
        <IconButton
          ref={anchorRef}
          color="primary"
          onClick={handleToggle}
          style={{ padding: "12px 0 12px 0" }}
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
                  {Object.entries(languages).map(([key, value]) => (
                    <MenuItem
                      key={key}
                      value={key}
                      selected={key === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, key)}
                    >
                      {value}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
