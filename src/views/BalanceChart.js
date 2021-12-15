import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";

export default function BalanceChart() {
  const balanceChartReference = useRef();
  const [symbol, setSymbol] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const sessionValidationId = urlParams.get("session_validation_id");

  const getOperations = async (validationId) => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(
        `${API_URL}validation/${validationId}/operations`
      );
      const data = await response.json();

      const newBlanceHistory = [];
      data.map((operation) => {
        newBlanceHistory.push({
          x: moment(operation.endDate).valueOf(),
          y: operation.balance,
        });
      });
      balanceChartReference.current.chart.updateSeries([
        { data: newBlanceHistory },
      ]);
      setTimeout(updateChartImage, 500);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    const abortController = new AbortController();
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    try {
      const responseCurrencies = await fetch(`${API_URL}currencies/`, {
        signal: abortController.signal,
      });
      if (!responseCurrencies.ok)
        throw new Error("Currencies fetch finished with errors");
      const dataCurrencies = await responseCurrencies.json();

      setSymbol(dataCurrencies[0].symbol);
      getOperations(sessionValidationId);
    } catch (error) {
      console.error(error);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const updateChartImage = async () => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const { imgURI } = await balanceChartReference.current.chart.dataURI();
    try {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > 40000) {
          break;
        }
      }
      const response = await fetch(
        `${API_URL}validation/${sessionValidationId}/updateBalanceChart`,
        {
          method: "PUT",
          body: JSON.stringify({ image: imgURI }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("Balance chart update finished with errors.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Chart
      id="balanceChart"
      ref={balanceChartReference}
      type="area"
      height="30%"
      width="40%"
      series={[
        {
          data: [],
        },
      ]}
      options={{
        xaxis: { type: "datetime" },
        yaxis: {
          labels: {
            show: true,
            formatter: (value) => {
              return `${value} ${symbol}`;
            },
          },
        },
        dataLabels: { enabled: false },
        tooltip: {
          x: {
            show: false,
            format: "dd/MM/yyyy HH:mm",
          },
          y: {
            title: {
              formatter: () => {
                return "Balance:";
              },
            },
          },
        },
      }}
    />
  );
}
