import React from "react";
import PropTypes from "prop-types";

import Box from "@material-ui/core/Box";

import StrategyCard from "./StrategyCard";

Recent.propTypes = {
  strategies: PropTypes.array.isRequired,
};

export default function Recent(props) {
  const { strategies } = props;
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
    >
      {strategies.slice(0, 3).map((strategy) => {
        return (
          <Box key={strategy.id} py="5px">
            <StrategyCard
              id={strategy.id}
              title={strategy.title}
              author={strategy.user.name}
              shared_date={strategy.shared_date}
              image={strategy.image}
              downloads={strategy.downloads}
              timeframe={strategy.tf && strategy.tf.name}
              asset={strategy.ticker && strategy.ticker.display_name}
              profit={strategy.profit}
              risk={strategy.risk}
            />
          </Box>
        );
      })}
    </Box>
  );
}
