import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SharedStrategiesTable from "components/Strategies/SharedStrategies";
import UserStrategies from "components/Strategies/UserStrategies";
import LoadingShow from "components/common/LoadingShow";
import { useTranslation } from "react-i18next";

export default function Strategies() {
  const { t } = useTranslation("strategies");
  const [strategies, setStrategies] = useState([]);
  const [value, setValue] = useState(1); // 1: My Strategy, 2: Shared Strategy
  const [isLoading, setLoading] = useState(true);
  const [refreshStrategy, setRefrestStragety] = useState(false);

  const handleChange = (event, newValue) => {
    setStrategies([]);
    setValue(newValue);
  };

  useEffect(async () => {
    console.log("[fetching]");
    const abortController = new AbortController();
    let url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");

    // Fetch strategies or shared strategies.
    value == 1
      ? (url = `${url}strategies/user/${userId}`)
      : (url = `${url}sharedStrategies/`);

    try {
      const response = await fetch(url, { signal: abortController.signal });
      if (!response.ok) throw new Error("Strategy fetch finished with errors.");
      const data = await response.json();
      setStrategies(data);
      console.log("[set date]");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        "There was an error fetching Strategies. Please contact support for further information." +
          error
      );
    }
    return () => {
      abortController.abort();
    };
  }, [value, refreshStrategy]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      position="relative"
    >
      {isLoading ? (
        <LoadingShow />
      ) : (
        <>
          <Box display="flex" width="100%" bgcolor="#FBFBFD">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Mostrar estrategias"
              indicatorColor="primary"
            >
              <Tab label={t("MyStrategies")} value={1} />
              <Tab label={t("SharedStrategies")} value={0} />
            </Tabs>
          </Box>
        </>
      )}
      {value == 1 && (
        <UserStrategies
          strategies={strategies}
          setRefrestStragety={setRefrestStragety}
          refreshStrategy={refreshStrategy}
        />
      )}
      {value == 0 && <SharedStrategiesTable strategies={strategies} />}
    </Box>
  );
}
