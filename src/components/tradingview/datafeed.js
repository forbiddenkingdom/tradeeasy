/* eslint-disable no-unused-vars */
import { makeApiRequest } from "./helpers.js";

export const configurationData = {
  supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
};
async function getAllSymbols() {
  const data = await makeApiRequest("tickers/");
  const symbols = data.map((ticker) => {
    return {
      symbol: ticker.id,
      full_name: ticker.display_name,
      description: ticker.name,
      exchange: "tradEAsy",
      type: ticker.group.toLowerCase(),
      decimal_number: ticker.decimal_number,
    };
  });
  return symbols;
}

// Chart Methods
export default {
  onReady: (callback) => {
    window.time_range = null;
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback
  ) => {
    // Code here...
  },
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find((symbol) => symbol.symbol == symbolName);
    if (!symbolItem) {
      onResolveErrorCallback("cannot resolve symbol");
      return;
    }
    const symbolInfo = {
      name: symbolName,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Europe/Athens",
      exchange: "tradEAsy",
      minmov: 1,
      pricescale: symbolItem.decimal_number,
      has_intraday: true,
      has_no_volume: false,
      // Please note, that the library can build weekly and monthly resolutions from 1D, if we add these resolutions to the supported ones,
      // but we need to directly specify that the datafeed doesn't have these resolutions by setting has_weekly_and_monthly to false.
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) => {
    let fromd = new Date(from * 1000);
    let tod = new Date(to * 1000);

    const MIN_INTERVAL = 59996.53;

    if (window.gotoRange) {
      from = window.gotoRange.from - 1440 * resolution * 60;
      to = window.gotoRange.to + 1440 * resolution * 60;
      window.gotoRange = null;
    }

    const symbol = symbolInfo.description;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_TRADINGVIEW_API}api/trading/${symbol}/${resolution}/${from}/${to}`
      );
      const data = await response.json();

      if (!data.Data.length) {
        onHistoryCallback([], { noData: true });
      }
      let bars = data.Data.map((el) => {
        return {
          time: el.time * 1000, //TradingView requires bar time in ms
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volumefrom,
        };
      });
      bars = bars.sort(function (a, b) {
        if (a.time < b.time) return -1;
        else if (a.time > b.time) return 1;
        return 0;
      });
      let fromd = new Date(bars[0].time);
      let tod = new Date(bars[bars.length - 1].time);

      // Window obj for the time range of the chart to stop drawing
      let res_from = bars[0].time / 1000;
      let res_to = bars[bars.length - 1].time / 1000;
      window.time_range = { start: res_from, end: res_to };
      window.reached = false;

      // onHistoryCallback([]), { noData: false}
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    // Code here...
    window.resetCacheNeededCallback = onResetCacheNeededCallback;
  },
  unsubscribeBars: (subscriberUID) => {
    // Code here...
  },
};
