import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { useTranslation } from "react-i18next";
Row.propTypes = {
  id: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  openDate: PropTypes.string.isRequired,
  openPrice: PropTypes.number.isRequired,
  closeDate: PropTypes.string.isRequired,
  closePrice: PropTypes.number.isRequired,
  profit: PropTypes.number.isRequired,
  comission: PropTypes.number.isRequired,
  swap: PropTypes.number.isRequired,
  vol: PropTypes.number.isRequired,
  onOptRowClick: PropTypes.func,
};

export default function Row({
  id,
  symbol,
  type,
  openDate,
  openPrice,
  closeDate,
  closePrice,
  profit,
  comission,
  swap,
  vol,
  onOptRowClick,
}) {
  const [t] = useTranslation("validation");
  return (
    <TableRow tabIndex={-1}>
      <TableCell>
        <Button
          variant="outlined"
          disableElevation
          color="primary"
          size="small"
          onClick={() => onOptRowClick(openDate, closeDate)}
        >
          <SearchIcon />
        </Button>
      </TableCell>
      <TableCell>{id}</TableCell>
      <TableCell>{type ? t("sell") : t("buy")}</TableCell>
      <TableCell>
        {moment(openDate).utc().format("YYYY.MM.DD HH:mm:ss")}
      </TableCell>
      <TableCell>{vol}</TableCell>
      <TableCell>
        {openPrice} {symbol}
      </TableCell>
      <TableCell>
        {moment(closeDate).utc().format("YYYY.MM.DD HH:mm:ss")}
      </TableCell>
      <TableCell>
        {closePrice} {symbol}
      </TableCell>
      <TableCell>
        {profit.toFixed(2)} {symbol}
      </TableCell>
      <TableCell>
        {comission.toFixed(2)} {symbol}
      </TableCell>
      <TableCell>
        {swap.toFixed(2)} {symbol}
      </TableCell>
    </TableRow>
  );
}
