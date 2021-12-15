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
import ValidationTableRow from "./ValidationTableRow";

const headerCells = [
  {
    id: "title",
    label: "validationTable.validationId",
  },
  {
    id: "riskProfit",
    label: "validationTable.riskProfit",
  },
  { id: "asset", label: "validationTable.asset" },
  {
    id: "timeframe",
    label: "Timeframe",
  },
  {
    id: "validationTime",
    label: "validationTable.validationTime",
  },
];
// Styles
const useStyles = makeStyles((theme) => ({
  table: {
    borderSpacing: "0px 14px",
    borderCollapse: "separate",
    backgroundColor: "#FAFAFA",
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
export default function UserValidation({ validations = [] }) {
  // Hooks
  const classes = useStyles();
  const { t } = useTranslation("myValidation");
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
        {validations
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((validation) => {
            let profit = (
              ((validation.result ? validation.result.gain : 0) * 100) /
              Number(validation.balance)
            ).toFixed(1);
            return (
              <ValidationTableRow
                key={validation.id}
                t={t}
                id={validation.id}
                // title={validation.title}
                sessionId={validation.sessionId}
                validated={validation.status}
                // shared={validation.shared}
                sesionhistid={validation.session_hist_id}
                profit={profit}
                risk={validation.result.relativeDrawdown.toFixed(0)}
                ticker={validation.ticker}
                timeframe={validation.timeframe}
                tickerId={validation.tickerId}
                timeframeId={validation.timeframeId}
                owner={validation.owner}
                shareDate={validation.createDate}
                image={validation.image}
                currency={validation.currency}
                operations={{
                  trades_win: validation.result
                    ? validation.result.trades_win
                    : 0,
                  trades_loss: validation.result
                    ? validation.result.trades_loss
                    : 0,
                  gain_loss_rate: validation.result
                    ? validation.result.gain_loss_rate
                    : 0,
                  gains_only: validation.result ? validation.result.gains : 0,
                  loses_only: validation.result ? validation.result.loses : 0,
                  best_gain: validation.result ? validation.result.best : 0,
                  worst_loss: validation.result ? validation.result.wost : 0,
                  drawdown: validation.result ? validation.result.drawdown : 0,
                  relativeRunup: validation.result
                    ? validation.result.relativeRunup
                    : 0,
                  runup: validation.result ? validation.result.runup : 0,
                  relativeDrawdown: validation.result
                    ? validation.result.relativeDrawdown
                    : 0,
                }}
              />
            );
          })}
      </Box>

      <Box component="tfoot" display="flex" width="100%" mt="auto">
        <Box component="tr" display="flex" width="100%">
          <Box
            rowsPerPageOptions={[25, 50, 100]}
            count={validations.length}
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
UserValidation.propTypes = {
  validations: PropTypes.array.isRequired,
};
