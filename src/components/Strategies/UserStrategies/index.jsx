import React from "react";
import PropTypes from "prop-types";
// Frameworks
import { useTranslation } from "react-i18next";
//Material UI
import Box from "@material-ui/core/Box";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// Assets
import "@fontsource/karla/700.css";
// Custom Components
import StrategyRow from "./StrategyRow";

const headerCells = [
  {
    id: "title",
    label: "strategyTable.strategyName",
  },
  {
    id: "riskProfit",
    label: "strategyTable.riskProfit",
  },
  { id: "asset", label: "strategyTable.asset" },
  {
    id: "timeframe",
    label: "Timeframe",
  },
  {
    id: "lastEdit",
    label: "strategyTable.lastEdit",
  },
];
// Styles
const useStyles = makeStyles((theme) => ({
  table: {
    borderSpacing: "0px 14px",
    borderCollapse: "separate",
    backgroundColor: "white",
  },
  tableHeader: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  tableRow: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  movileRow: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
}));

// Main Component
export default function UserStrategies({
  strategies = [],
  setRefrestStragety,
  refreshStrategy,
}) {
  // Hooks
  const classes = useStyles();
  const { t } = useTranslation("strategies");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <Box
      component="table"
      className={classes.table}
      display="flex"
      flexDirection="column"
      width="100%"
      p={2}
      pb={0}
      overflow="auto"
      height="100%"
    >
      <Box
        component="thead"
        display="flex"
        width="100%"
        className={classes.tableHeader}
      >
        <Box
          display="flex"
          width="100%"
          component="tr"
          bgcolor="#253E66"
          borderRadius="10px"
          px={2}
          justifyContent="center"
        >
          {headerCells.map((headerCell) => (
            <Box
              key={headerCell.id}
              component="td"
              color="white"
              py={2}
              width="20%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography component="h2">{t(headerCell.label)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        component="tbody"
        display="flex"
        flexDirection="column"
        overflow="auto"
      >
        {strategies
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((strategy) => {
            return (
              <StrategyRow
                key={strategy.id}
                t={t}
                id={strategy.id}
                title={strategy.title}
                validated={strategy.validated}
                shared={strategy.shared}
                profit={strategy.profit.toFixed(1)}
                risk={strategy.risk.toFixed(0)}
                ticker={strategy.ticker && strategy.ticker.display_name}
                timeframe={strategy.tf && strategy.tf.name}
                owner={strategy.user.name}
                shareDate={strategy.shared_date}
                image={strategy.image}
                currency={strategy.currency}
                setRefrestStragety={setRefrestStragety}
                refreshStrategy={refreshStrategy}
                operations={{
                  trades_win: strategy.trades_win,
                  trades_loss: strategy.trades_loss,
                  gain_loss_rate: strategy.gain_loss_rate,
                  gains_only: strategy.gains_only,
                  loses_only: strategy.loses_only,
                  best_gain: strategy.best_gain,
                  worst_loss: strategy.worst_loss,
                  drawdown: strategy.drawdown,
                  relativeRunup: strategy.relativeRunup,
                  runup: strategy.runup,
                  relativeDrawdown: strategy.relativeDrawdown,
                }}
              />
            );
          })}
      </Box>

      <Box component="tfoot" display="flex" width="100%" mt="auto">
        <Box component="tr" display="flex" width="100%">
          <Box
            rowsPerPageOptions={[25, 50, 100]}
            count={strategies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            component={TablePagination}
            width="100%"
          />
        </Box>
      </Box>
    </Box>
  );
}
// Prop Types
UserStrategies.propTypes = {
  strategies: PropTypes.array.isRequired,
  setRefrestStragety: PropTypes.func,
  refreshStrategy: PropTypes.bool,
};
