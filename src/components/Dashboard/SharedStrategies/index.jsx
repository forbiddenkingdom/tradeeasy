import React, { useEffect, useState } from "react";

// Material UI Components
import { withStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import Box from "@material-ui/core/Box";
// Custom components
import ComponentTitle from "components/Dashboard/ComponentTitle";
import Popular from "./Popular";
import Recent from "./Recent";
import { useTranslation } from "react-i18next";

const CustomTab = withStyles({
  selected: {
    opacity: "1",
    borderRadius: "3px",
    color: "#fff!important",
    backgroundColor: "#25AAE2",
  },
  root: {
    color: "black",
  },
})(Tab);

const CustomAppBar = withStyles({
  root: {
    borderRadius: "10px 0px 0px 0px",
    flexDirection: "row",
    backgroundColor: "#fff",
    zIndex: "auto",
  },
})(AppBar);

const CustomTabs = withStyles({
  indicator: {
    opacity: 0,
  },
})(Tabs);

const useStyles = makeStyles({
  content: {
    padding: "0px 24px 0px 24px",
    "@media (max-width: 374px)": {
      padding: "0px 10px 0px 10px",
    },
  },
});

export default function SharedStrategies() {
  const [t] = useTranslation("dashboard");
  const [strategies, setStrategies] = useState([]);
  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    try {
      let response = await fetch(`${url}sharedStrategies/`, {
        signal: abortController.signal,
      });
      let estrategias = await response.json();
      estrategias.sort((a, b) => (a.downloads > b.downloads ? -1 : 1)); // Sort array by downloads.
      setStrategies(estrategias);
    } catch (error) {
      console.error("There as an error fetching shared strategies:" + error);
    }
    return () => {
      abortController.abort();
    };
  }, []);
  const [tab, setTab] = useState("popular");
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };
  useEffect(() => {
    let sortedArray;
    if (tab === "popular") {
      sortedArray = [...strategies].sort((a, b) =>
        a.downloads > b.downloads ? -1 : 1
      );
    } else if (tab === "recent") {
      sortedArray = [...strategies].sort((a, b) =>
        a.shared_date > b.shared_date ? -1 : 1
      );
    }
    setStrategies(sortedArray);
  }, [tab]);
  const classes = useStyles();

  return (
    <Box display="flex" height="100%">
      <Box
        bgcolor="#fff"
        width="100%"
        height="100%"
        borderRadius="10px 0px 0px 10px"
        display="flex"
        flexDirection="column"
        pb={2}
      >
        <TabContext value={tab}>
          <CustomAppBar position="static" elevation={0}>
            <Box display="flex" alignItems="center">
              <ComponentTitle>{t("sharedStrategies")}</ComponentTitle>
            </Box>
            <Box display="flex" marginLeft="auto">
              <CustomTabs value={tab} onChange={handleChange}>
                <CustomTab label={t("popular")} value="popular" />
                <CustomTab label={t("recent")} value="recent" />
              </CustomTabs>
            </Box>
          </CustomAppBar>
          <TabPanel value="popular" className={classes.content}>
            <Popular strategies={strategies} />
          </TabPanel>
          <TabPanel value="recent" className={classes.content}>
            <Recent strategies={strategies} />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
}
