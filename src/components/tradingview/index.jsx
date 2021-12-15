/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Datafeed from "./datafeed";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { drawStrategy, pintarLinea } from "./helpers";
import moment from "moment";

Chart.propTypes = {
  symbol: PropTypes.number.isRequired,
  timeframe: PropTypes.number.isRequired,
  symbols: PropTypes.array.isRequired,
  timeframes: PropTypes.array.isRequired,
  height: PropTypes.string,
  operations: PropTypes.array.isRequired,
  targetRange: PropTypes.array,
  isHistory: PropTypes.bool,
};

export default function Chart({
  symbol,
  timeframe,
  symbols,
  timeframes,
  height,
  operations,
  targetRange,
  isHistory = false,
}) {
  const [tvWidget, setTVWidget] = useState(null);
  // const [indicator, setIndicator] = useState('Moving Average');
  // const [indicator, setIndicator] = useState('Relative Strength Index');

  // Move chart to the range of the selected row.
  useEffect(async () => {
    if (!targetRange || !tvWidget) return;

    let from = new Date(targetRange.x1);
    from = from.getTime() / 1000 - 20000;
    let to = new Date(targetRange.x2);
    to = to.getTime() / 1000 + 20000;

    const selectedTimeframe = timeframes.find((tf) => tf.id == timeframe);

    // If there are more than 1900 items between them then lower to
    let maxi = 1900 * Number(selectedTimeframe.key) * 60;
    if (to - from > maxi) {
      to = from + maxi;
    }

    let fromd = new Date(from * 1000);
    let tod = new Date(to * 1000);

    window.gotoRange = { from: from, to: to };

    //if(!Object.prototype.hasOwnProperty.call(window.tvWidget, 'activeChart')) return;
    //if (window.tvWidget && window.tvWidget.activeChart()) {
    try {
      // Clear cache
      await window.resetCacheNeededCallback();
      await window.tvWidget.activeChart().resetData();

      setTimeout(() => {
        window.tvWidget.activeChart().setVisibleRange({ from: from, to: to });
      }, 2000);
    } catch(err) {
      console.log("[chart not defined]");
    }

    //}
  }, [targetRange]);

  useEffect(() => {
    const selectedSymbol = symbols.find((ticker) => ticker.id == symbol);
    const selectedTimeframe = timeframes.find((tf) => tf.id == timeframe);
    if (selectedSymbol) {
      var disabledFeatures = [
        "header_symbol_search",
        "header_compare",
        "header_saveload",
        // "timeframes_toolbar",
        // "legend_widget",
        "main_series_scale_menu",
        "header_settings",
        "header_resolutions",
        "header_screenshot",
        "header_undo_redo",
      ];
      if (!isHistory) disabledFeatures.push("timeframes_toolbar");

      // eslint-disable-next-line no-undef
      const widget = (window.tvWidget = new TradingView.widget({
        symbol: selectedSymbol.id,
        interval: selectedTimeframe.key,
        fullscreen: false,
        width: "100%",
        height: "100%",
        container_id: "tv_chart_container",
        datafeed: Datafeed,
        library_path: "/charting_library/",
        overrides: {
          "paneProperties.vertGridProperties.color": "#E3E3E5", // Grid Vertical Lines Color
          "paneProperties.horzGridProperties.color": "#E3E3E5", // Grid Horizontal Lines Color
          "mainSeriesProperties.candleStyle.upColor": "#11CC9A", // Up Candle Color
          "mainSeriesProperties.candleStyle.downColor": "#E20E7C", // Down Candle Color
          "mainSeriesProperties.candleStyle.borderUpColor": "#11CC9A", // Up Candle Border Color
          "mainSeriesProperties.candleStyle.borderDownColor": "#E20E7C", // Down Candle Border Color
          "mainSeriesProperties.candleStyle.drawBorder": false, // Disable candle borders
        },
        disabled_features: disabledFeatures,
        time_frames: [],
      }));

      widget.onChartReady(async () => {
        // Draw default indicators
        if (!isHistory) {
          try {
            const USER_ID = localStorage.getItem("user_id");
            // Get the indicator data
            const res = await fetch(
              `${process.env.REACT_APP_TRADEASY_API}indicators/${USER_ID}`
            );
            if (!res.ok)
              throw new Error("Indicators fetch finished with errors.");
            const indicators = await res.json();
            if (indicators) {
              indicators.forEach((indicator) => {
                let params = [];
                let styles = {};

                for (let i = 1; i < 10; i++) {
                  if (indicator["param" + i]) {
                    params.push(indicator["param" + i]);
                  }
                  if (indicator["style" + i]) {
                    let st = indicator["style" + i].split("=");
                    if (st.length != 2) continue;
                    styles[st[0]] = st[1];
                  }
                }

                widget
                  .activeChart()
                  .createStudy(
                    indicator.indicatorName,
                    false,
                    false,
                    params,
                    styles
                  );
              });
            }
          } catch (error) {
            console.error(error);
          }
        }

        // Drawing Buy and Sells
        operations.map((operation) => {
          const startDate = moment(operation.startDate).unix();
          const endDate = moment(operation.endDate).unix();
          console.log(startDate);
          if (operation.operationType) {
            //Sell
            drawStrategy(
              widget,
              true,
              "Sell Open",
              startDate,
              operation.startPrice,
              operation.volume
            );
            drawStrategy(
              widget,
              false,
              "Sell Close",
              endDate,
              operation.endPrice,
              operation.volume
            );
            pintarLinea(
              widget,
              startDate,
              endDate,
              operation.startPrice,
              operation.endPrice
            );
          } else {
            // Buy
            drawStrategy(
              widget,
              true,
              "Buy Open",
              startDate,
              operation.startPrice,
              operation.volume
            );
            drawStrategy(
              widget,
              false,
              "Buy Close",
              endDate,
              operation.endPrice,
              operation.volume
            );
            pintarLinea(
              widget,
              startDate,
              endDate,
              operation.startPrice,
              operation.endPrice
            );
          }
        });

        widget
          .activeChart()
          .onVisibleRangeChanged()
          .subscribe(null, ({ from, to }) => {
            let fromd = new Date(from * 1000);
            let tod = new Date(to * 1000);

            if (
              to >= window.time_range.end
              // || to >= window.strategy_range.to
            ) {
              if (
                window.reached == false ||
                window.reached_range == undefined
              ) {
                window.reached = true;
                window.reached_range = {
                  from: from,
                  to: window.time_range.end,
                };
              }
            } else if (
              from <= window.time_range.start
              // || from <= window.strategy_range.from
            ) {
              if (
                window.reached == false ||
                window.reached_range == undefined
              ) {
                window.reached = true;
                window.reached_range = {
                  from: window.time_range.start,
                  to: to,
                };
              }
            } else {
              window.reached = false;
              // window.reached_range = { from: from, to: to};
            }
            if (window.reached) {
              window.tvWidget.activeChart().setVisibleRange({
                from: window.reached_range.from,
                to: window.reached_range.to,
              });
            }

            // Drawing operations like buying and selling
            operations.map((operation) => {
              const startDate = moment(operation.startDate).unix();
              const endDate = moment(operation.endDate).unix();
              if (operation.operationType == 0) {
                if (
                  endDate > from &&
                  endDate < to &&
                  startDate > from &&
                  startDate < to
                ) {
                  pintarLinea(
                    widget,
                    startDate,
                    endDate,
                    operation.startPrice,
                    operation.endPrice
                  );
                }
                // if (startDate > from && startDate < to) {
                //   pintarFlecha( widget, startDate, "arrow_up", "Buy", operation.startPrice.toFixed(2) );
                // }
                // if (endDate > from && endDate < to) {
                //   pintarFlecha( widget, endDate, "arrow_down", operation.profit.toFixed(2), operation.endPrice.toFixed(2) );
                // }
              } else {
                if (
                  endDate > from &&
                  endDate < to &&
                  startDate > from &&
                  startDate < to
                ) {
                  pintarLinea(
                    widget,
                    startDate,
                    endDate,
                    operation.startPrice,
                    operation.endPrice
                  );
                }
                // if (startDate > from && startDate < to) {
                //   pintarFlecha( widget, startDate, "arrow_down", "Sell" + "\n\n", operation.startPrice.toFixed(2) );
                // }
                // if (endDate > from && endDate < to) {
                //   pintarFlecha( widget, endDate, "arrow_up", "\n" + operation.profit.toFixed(2), operation.endPrice.toFixed(2) );
                // }
              }
            });
          });
      });

      setTVWidget(widget);
    }
  }, [operations]);
  return <Box id="tv_chart_container" height={height}></Box>;
}
