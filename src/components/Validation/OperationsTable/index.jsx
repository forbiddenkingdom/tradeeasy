import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/core";

import TableHead from "./TableHead";
import TableRow from "./TableRow";

const useStyles = makeStyles({
  tableContainer: {
    display: "flex",
    height: "100%",
  },
  table: {
    alignSelf: "flex-start",
  },
});

OperationsTable.propTypes = {
  operations: PropTypes.array,
  symbol: PropTypes.string,
  onOptRowClick: PropTypes.func,
};

export default function OperationsTable({
  operations = [],
  symbol = "",
  onOptRowClick,
}) {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader className={classes.table}>
        <TableHead />
        <TableBody>
          {operations.map((operation) => {
            return (
              <TableRow
                key={operation.id}
                symbol={symbol}
                id={operation.id}
                type={operation.operationType}
                openDate={operation.startDate}
                openPrice={operation.startPrice}
                closeDate={operation.endDate}
                closePrice={operation.endPrice}
                profit={operation.profit}
                comission={operation.comission}
                swap={operation.swap}
                vol={operation.volume}
                onOptRowClick={onOptRowClick}
              ></TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
