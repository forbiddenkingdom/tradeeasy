import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import UserValidationTable from "components/MyValidations";
import LoadingShow from "components/common/LoadingShow";

export default function MyValidation() {
  const [validations, setValidations] = useState([]);
  const [load, setLoad] = useState(true);
  const [isLoading, setLoading] = useState(true);

  useEffect(async () => {
    if (load) {
      setLoad(false);

      const abortController = new AbortController();
      const userId = localStorage.getItem("user_id");

      let url = `${process.env.REACT_APP_TRADEASY_API}user/${userId}/relationships/validations`;
      // let url = `${process.env.REACT_APP_TRADEASY_API}strategies/user/${userId}`;

      try {
        let response = await fetch(url, { signal: abortController.signal });
        if (!response.ok)
          throw new Error("Strategy fetch finished with errors.");
        let valid_data = await response.json();

        // User name
        response = await fetch(
          `${process.env.REACT_APP_TRADEASY_API}users/${userId}`,
          { signal: abortController.signal }
        );
        if (!response.ok)
          throw new Error("Profile name fetch finished with errors.");
        let user_data = await response.json();
        // valid_data['owner'] = data.alias;

        // Ticker Name
        response = await fetch(`${process.env.REACT_APP_TRADEASY_API}tickers`, {
          signal: abortController.signal,
        });
        if (!response.ok)
          throw new Error("Profile name fetch finished with errors.");
        let ticker_data = await response.json();

        // Timeframe Name
        response = await fetch(
          `${process.env.REACT_APP_TRADEASY_API}timeframes`,
          { signal: abortController.signal }
        );
        if (!response.ok)
          throw new Error("Profile name fetch finished with errors.");
        let timeframe_data = await response.json();

        valid_data.map((item) => {
          item["owner"] = user_data.alias;

          let ticker = ticker_data.find((t) => t.id == item.tickerId);
          item["ticker"] = ticker ? ticker.display_name : "";

          let timeframe = timeframe_data.find((m) => m.id == item.timeframeId);
          item["timeframe"] = timeframe ? timeframe.name : "";
        });

        setValidations(valid_data);
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
    }
  }, [load]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      position="relative"
    >
      {isLoading && <LoadingShow />}
      <UserValidationTable validations={validations} />
    </Box>
  );
}
