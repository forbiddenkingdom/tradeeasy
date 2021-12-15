import React from "react";
import PropTypes from "prop-types";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Animation,
  EventTracker,
  HoverState,
  Palette,
} from "@devexpress/dx-react-chart";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: 3,
  },
});

StrategyCircularChart.propTypes = {
  data: PropTypes.array.isRequired,
  palette: PropTypes.array.isRequired,
};

export default function StrategyCircularChart(props) {
  const { data, palette } = props;
  const clss = useStyles();
  return (
    <Chart className={clss.root} width={70} height={70} data={data}>
      <Palette scheme={palette} />
      <PieSeries valueField="count" argumentField="asset" innerRadius={0.8} />
      <Animation />
      <EventTracker />
      <HoverState />
      <Tooltip />
    </Chart>
  );
}
