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

export default function DonutChart({ data, palette }) {
  return (
    <Chart width={110} height={110} data={data}>
      <Palette scheme={palette} />
      <PieSeries valueField="count" argumentField="asset" innerRadius={0.8} />
      <Animation />
      <EventTracker />
      <HoverState />
      <Tooltip />
    </Chart>
  );
}
// PropTypes
DonutChart.propTypes = {
  data: PropTypes.array.isRequired,
  palette: PropTypes.array.isRequired,
};
