import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

export const drawStrategy = (
  widget,
  is_buy = true,
  text,
  time,
  price,
  volume
) => {
  // if (!widget || !Object.prototype.hasOwnProperty.call(widget, "activeChart"))
  //   return;

    // console.log("ENTERED WITH TRADE")
  try {
    if (is_buy) {
      widget
        .activeChart()
        .createExecutionShape()
        .setText(text + "/" + volume)
        // .setTooltip("@1,320.75 Limit Buy 1")
        .setTextColor("rgba(217,170,54,1)")
        .setFont("13px Verdana")
        // .setArrowHeight('13')
        // .setArrowSpacing('5')
        .setArrowColor("#FF0")
        .setDirection("buy")
        .setTime(time)
        .setPrice(price);
    } else {
      widget
        .activeChart()
        .createExecutionShape()
        .setText(text + "/" + volume)
        // .setTooltip("@1,320.75 Limit Buy 1")
        .setTextColor("rgba(37,62,102,1)")
        .setFont("13px Verdana")
        // .setArrowHeight('13')
        // .setArrowSpacing('5')
        .setArrowColor("#F00")
        .setDirection("sell")
        .setTime(time)
        .setPrice(price);
    }
  } catch(error) {
    console.log(error);
  }
  
};

export const pintarLinea = (widget, a1, b1, price1, price2) => {
  widget.activeChart().createMultipointShape(
    [
      { time: a1, price: price1, channel: "open" },
      { time: b1, price: price2, channel: "open" },
    ],
    {
      shape: "trend_line",
      lock: true,
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
      bringToFrontEnabled: true,
    }
  );
};

export const pintarFlecha = (widget, a1, shape, text, price) => {
  let id = widget.activeChart().createShape(
    { time: a1, price, channel: "open" },
    {
      shape: shape,
      text: text,
      lock: true,
      disableSelection: true,
      disableSave: true,
      disableUndo: true,
    }
  );
  widget.activeChart().bringToFront([id]);
};
/**
 * Make requests to CryptoCompare API
 * @param {String} path
 * @returns {JSON}
 */
export async function makeApiRequest(path) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_TRADEASY_API}${path}`
    );

    //const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    return response.json();
  } catch (error) {
    throw new Error(`tradEAsy API request error: ${error.status}`);
  }
}
