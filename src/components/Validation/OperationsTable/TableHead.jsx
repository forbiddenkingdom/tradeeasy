import React from "react";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  row: {
    fontWeight: 700,
  },
});

export default function Row() {
  const classes = useStyles();
  const [t] = useTranslation("validation");
  const HEADER_CELLS = [
    {
      id: 0,
      name: "",
    },
    {
      id: 1,
      name: "ID",
    },
    {
      id: 2,
      name: t("operationsTable.operationType"),
    },
    {
      id: 3,
      name: t("operationsTable.openDate"),
    },
    {
      id: 4,
      name: t("operationsTable.volume"),
    },
    {
      id: 5,
      name: t("operationsTable.openPrice"),
    },
    {
      id: 6,
      name: t("operationsTable.closeDate"),
    },
    {
      id: 7,
      name: t("operationsTable.closePrice"),
    },
    {
      id: 8,
      name: t("operationsTable.profit"),
    },
    {
      id: 9,
      name: t("operationsTable.commision"),
    },
    {
      id: 10,
      name: t("operationsTable.swap"),
    },
  ];
  return (
    <TableHead>
      <TableRow tabIndex={-1}>
        {HEADER_CELLS.map((headCell) => {
          return (
            <TableCell key={headCell.id} className={classes.row}>
              {" "}
              {headCell.name}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
