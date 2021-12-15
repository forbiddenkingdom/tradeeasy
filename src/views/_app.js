// React
import React from "react";
import PropTypes from "prop-types";
// Framework
import { useTranslation } from "react-i18next";
import { Switch, Link, Route, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  AppBar,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Box,
  makeStyles,
  useTheme,
} from "@material-ui/core";

// MaterialUI Icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import BuilderIcon from "assets/icons/BuilderIcon";
import DashboardIcon from "assets/icons/DashboardIcon";
import StrategiesIcon from "assets/icons/StrategiesIcon";
import SettingsIcon from "assets/icons/SettingsIcon";
import FolderIcon from "assets/icons/FolderIcon";
import NewsIcon from "assets/icons/NewsIcon";
import TimelineIcon from "@material-ui/icons/Timeline";
import HelpIcon from "@material-ui/icons/Help";

// Assets
import LogoIcon from "assets/img/logoIcon.png";
import LogoTitle from "assets/img/logoTitle.png";

// Components & Views
import useOrientation from "lib/hooks/useOrientation";
import Strategies from "views/Strategies";
import RotateView from "views/RotateView";
import MyValidation from "views/MyValidation";
import Builder from "views/Builder";
import BuilderMobile from "views/BuilderMobile";
import Profile from "views/Profile";
import Dashboard from "views/Dashboard";
import BalanceChart from "views/BalanceChart";
import Validation from "views/Validation";
import TradingView from "views/TradingView";
import ValidationMobile from "views/ValidationMobile";
import UserZone from "components/Dashboard/Appbar/UserZone";
import LanguagePicker from "components/Dashboard/Appbar/LanguagePicker";
import Notifications from "components/Dashboard/Appbar/Notifications";
import Login from "components/Auth/Login";

const drawerWidth = 240;
const drawerSmallWidth = 70;
const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerWrapperClose: {
    /********************************************************************** */
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("md")]: {
      width: drawerSmallWidth,
      flexShrink: 0,
    },
    "&:hover": {
      width: drawerWidth,
    },
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      // width: `calc(100% - ${drawerWidth}px)`,
      // marginLeft: drawerWidth,
    },
    backgroundColor: "#fafafa",
    color: "#555559",
  },
  appBarClose: {
    [theme.breakpoints.up("md")]: {
      // width: `calc(100% - ${drawerSmallWidth}px)`,
      // marginLeft: drawerSmallWidth,
    },
    backgroundColor: "#fafafa",
    color: "#555559",
  },
  appBarTitle: {
    fontWeight: 400,
    fontSize: "1.5rem",
    marginLeft: 12,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  toolbarCustom: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  menuButton: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#1A2B47",
    color: "#CECED4",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: "#1A2B47",
    color: "#CECED4",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    /******************************************************************** */
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#1A2B47",
    color: "#CECED4",
    overflowX: "hidden",
    width: drawerSmallWidth,
    // [theme.breakpoints.up('sm')]: {
    //   width: theme.spacing(9) + 1,
    // },
    "&:hover": {
      width: drawerWidth,
    },
  },
  appBarLogo: {
    marginTop: 40,
    marginBottom: 40,
  },
  alertTablet: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  alertMobile: {
    width: "100%",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
}));

export default function App() {
  const { isDesktop, isPortrait } = useOrientation();

  // Getting User Validation Count
  const [reload, setReload] = React.useState(false);
  React.useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    try {
      const resValidationCount = await fetch(
        `${url}user/${localStorage.getItem("user_id")}/validationCount`,
        { signal: abortController.signal }
      );

      if (!resValidationCount.ok) throw new Error("Validation Count Error!");

      const dataValidCount = await resValidationCount.json();

      if (
        localStorage.getItem("user_valid_count") !=
        dataValidCount.validation_count
      ) {
        localStorage.setItem(
          "user_valid_count",
          dataValidCount.validation_count
        );
      }
      if (localStorage.getItem("type_user") != dataValidCount.type_user) {
        localStorage.setItem("type_user", dataValidCount.type_user);
      }
      setTimeout(() => setReload(!reload), 10);
    } catch (err) {
      console.log("[err]", err);
      localStorage.setItem("user_valid_count", 0);
      setReload(!reload);
    }
  }, []);

  const theme = useTheme();
  const classes = useStyles();
  const [t] = useTranslation("global");
  const [u] = useTranslation("freemium");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [tab, setTab] = React.useState("dashboard");
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  let location = useLocation();
  React.useEffect(() => {
    setTab(location.pathname.slice(1, location.pathname.length));
  }, [location.pathname]);

  const handleResize = () => {};
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const drawerContent = (
    <>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon style={{ color: "#ccc" }}>
            <img
              className={classes.appBarLogo}
              src={LogoIcon}
              width={30}
              alt="tradEAsy Logo"
            />
          </ListItemIcon>
          <ListItemIcon style={{ color: "#ccc" }}>
            <img
              className={classes.appBarLogo}
              src={LogoTitle}
              width={150}
              alt="tradEAsy Logo"
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/dashboard"
          style={
            tab == "dashboard"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.dashboard")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/builder"
          style={
            tab == "builder"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <BuilderIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.builder")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/myvalidation"
          style={
            tab == "myvalidation"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.myvalidation")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/strategies"
          style={
            tab == "strategies"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <StrategiesIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.strategies")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/tradingview"
          style={
            tab == "tradingview"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.tradingview")} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/profile"
          style={
            tab == "profile"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.user-settings")} />
        </ListItem>
        <ListItem
          button
          component="a"
          href="https://web.tradeasy.tech/blog/"
          target="_blank"
          style={
            tab == "news"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <NewsIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.news")} />
        </ListItem>
        <ListItem
          button
          component="a"
          href="https://help.tradeasy.tech/"
          target="_blank"
          style={
            tab == "news"
              ? { backgroundColor: "#1A2B99" }
              : { backgroundColor: "#1A2B47" }
          }
        >
          <ListItemIcon style={{ color: "#ccc" }}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary={t("tabs.help")} />
        </ListItem>
      </List>
    </>
  );

  const UrlPath = window.location.pathname.split("/")[1];
  let isDashboard = UrlPath == "dashboard" || UrlPath == "" ? true : false;

  return (
    <>
      <Login />

      <Box display="flex" width="100%" height="100%">
        <nav
          className={isDashboard ? classes.drawer : classes.drawerWrapperClose}
        >
          <Hidden mdUp implementation="js">
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawerContent}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="js">
            <Drawer
              classnames={clsx(classes.drawerPaper, {
                [classes.drawerOpen]: isDashboard,
                [classes.drawerClose]: !isDashboard,
              })}
              classes={{
                paper: clsx(classes.drawerPaper, {
                  [classes.drawerOpen]: isDashboard,
                  [classes.drawerClose]: !isDashboard,
                }),
              }}
              variant="permanent"
              open
            >
              {drawerContent}
            </Drawer>
          </Hidden>
        </nav>

        <Box display="flex" flexDirection="column" width="100%" height="100%">
          <AppBar
            position="sticky"
            top={0}
            className={isDashboard ? classes.appBar : classes.appBarClose}
            elevation={0}
          >
            <Toolbar className={classes.toolbarCustom}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              {UrlPath == "validation" ? (
                <IconButton component={Link} to="/builder">
                  <ArrowBackIcon color="primary" />
                </IconButton>
              ) : null}
              <Typography variant="h5" noWrap className={classes.appBarTitle}>
                {UrlPath ? t("titles." + UrlPath) : t("titles.dashboard")}
              </Typography>
              {localStorage.getItem("type_user") == "F" && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginLeft="auto"
                >
                  <Typography>{u("former")}</Typography>&nbsp;
                  <Typography
                    href={u("plans_link")}
                    target="_blank"
                    component="a"
                  >
                    {u("improve")}
                  </Typography>
                </Box>
              )}
              <Box marginLeft="auto" display="flex" my={1}>
                <Notifications />
                <LanguagePicker />
                <UserZone />
              </Box>
            </Toolbar>

            {localStorage.getItem("type_user") == "F" && (
              <Box width="100%" className={classes.alertMobile}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginLeft="auto"
                  textAlign="center"
                >
                  <Typography>
                    {t("premiumWarning.former")}&nbsp;
                    <a href="#">{t("premiumWarning.later")}</a>
                  </Typography>
                </Box>
              </Box>
            )}
          </AppBar>

          <Box
            component="main"
            height="100%"
            width="100%"
            display="flex"
            overflow="auto"
          >
            <Switch>
              <Route exact path={["/dashboard", "/"]} component={Dashboard} />
              <Route
                path="/builder"
                component={
                  isDesktop
                    ? Builder
                    : isPortrait
                    ? () => <RotateView title="titles.builder" />
                    : BuilderMobile
                }
              />
              <Route path="/myvalidation" component={MyValidation} />
              <Route path="/strategies" component={Strategies} />
              <Route path="/tradingview" component={TradingView} />
              <Route path="/profile" component={Profile} />
              <Route path="/news" />
              <Route
                path="/validation"
                component={
                  isDesktop
                    ? Validation
                    : isPortrait
                    ? () => <RotateView title="titles.validation" />
                    : ValidationMobile
                }
              />
              <Route path="/validation" component={Validation} />
              <Route
                exact
                path={["/generate_balance_chart", "/"]}
                component={BalanceChart}
              />
            </Switch>
          </Box>
        </Box>
      </Box>
    </>
  );
}

App.propTypes = {
  location: PropTypes.object.isRequired,
  isLandscape: PropTypes.bool,
  isPortrait: PropTypes.bool,
};
