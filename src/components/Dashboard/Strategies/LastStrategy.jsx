import React, { useEffect, useState } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { loadRules } from "store/reducers/builder.reducer";
import { useDispatch } from "react-redux";
import { loadStrategy } from "store/reducers/strategy.reducer";
import { Redirect } from "react-router-dom";
import StrategyCard from "./StrategyCard";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  title: {
    color: "#555559",
  },
  validateButton: {
    marginLeft: "auto",
    borderRadius: "10px 0px 0px 10px",
  },
}));

export default function LastStrategy() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [t] = useTranslation("dashboard");
  const [session, setSession] = useState(undefined);
  const [loadRedirect, setLoadRedirect] = useState("/validation");
  const [isLoaded, setLoaded] = useState(false);
  useEffect(async () => {
    const USER_ID = localStorage.getItem("user_id");
    const ABORT_CONTROLLER = new AbortController();
    const URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const RESPONSE = await fetch(`${URL}session/${USER_ID}`, {
        signal: ABORT_CONTROLLER.signal,
      });
      if (!RESPONSE.ok)
        throw new Error("Last strategy fetch finished with errors.");
      const DATA = await RESPONSE.json();
      setSession(DATA);
    } catch (error) {
      console.error(error);
    }
    return () => {
      ABORT_CONTROLLER.abort();
    };
  }, []);
  const handleLoad = async (destination) => {
    try {
      await dispatch(
        loadRules({
          openRules: session.strategy
            ? JSON.parse(session.strategy.open_scenario)
            : JSON.parse(session.load_open_scenario),
          closeRules: session.strategy
            ? JSON.parse(session.strategy.close_scenario)
            : JSON.parse(session.load_close_scenario),
        })
      );
      await dispatch(
        loadStrategy({
          id: session.strategy && session.strategy.id,
          title: session.strategy && session.strategy.title,
          timeframe: session.strategy && session.strategy.timeframe,
          ticker: session.strategy && session.strategy.asset,
          balance: session.strategy && session.strategy.balance,
        })
      );
      if (session.strategy && session.strategy.validated)
        setLoadRedirect("/builder");
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Box
      bgcolor="#EBEBF2"
      borderRadius="10px 0px 0px 0px"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {
        /* Redirect to builder if load went succesful */
        isLoaded && <Redirect to={loadRedirect} />
      }
      <Box padding="16px 0px 16px 16px" display="flex" alignItems="center">
        <Typography variant="h5" className={classes.title}>
          {t("lastStrategy")}
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        p={4}
        pt={0}
      >
        {session && (
          <StrategyCard
            key={session.strategy ? session.strategy.id : session.sesion_id}
            loadLastStrategy={handleLoad}
            timeframe={
              session.strategy &&
              session.strategy.tf &&
              session.strategy.tf.name
            }
            creationDate={
              session.strategy ? session.strategy.created_at : session.fecha
            }
            asset={
              session.strategy &&
              session.strategy.ticker &&
              session.strategy.ticker.display_name
            }
            image={session.strategy && session.strategy.image}
            title={session.strategy && session.strategy.title}
            profit={session.strategy && session.strategy.profit}
            risk={session.strategy && session.strategy.risk}
            validated={session.strategy && session.strategy.validated}
          />
        )}
      </Box>
    </Box>
  );
}
