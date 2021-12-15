import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  id: 0,
  title: "",
  image: "",
  ticker: "",
  timeframe: "",
  startDate: moment("2020-01-01"),
  endDate: moment().subtract(1, "days"),
  balance: 1000,
  currency: "",
  gain: 0,
  tradesWon: 0,
  tradesLost: 0,
  successRate: 0,
  gainsOnly: 0,
  losesOnly: 0,
  gainLossRate: 0,
  bestGain: 0,
  worstLoss: 0,
  drawdown: 0,
  relativeDrawdown: 0,
  runup: 0,
  relativeRunup: 0,
  isSaved: false,
  isValidated: false,
};

export const strategySlice = createSlice({
  name: "strategy",
  initialState,
  reducers: {
    reset: (state) => initialState,
    loadStrategy: (state, action) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.ticker = action.payload.ticker;
      state.timeframe = action.payload.timeframe;
      state.balance = action.payload.balance;
      state.isValidated = false;
    },
    changeTitle: (state, action) => {
      state.title = action.payload;
      state.isValidated = false;
    },
    changeTicker: (state, action) => {
      state.ticker = action.payload;
      state.isValidated = false;
    },
    changeTimeframe: (state, action) => {
      state.timeframe = action.payload;
      state.isValidated = false;
    },
    changeValidationStatus: (state, action) => {
      state.isValidated = false;
    },
    changeStartDate: (state, action) => {
      state.startDate = action.payload;
      state.isValidated = false;
    },
    changeEndDate: (state, action) => {
      state.endDate = action.payload;
      state.isValidated = false;
    },
    changeBalance: (state, action) => {
      state.balance = action.payload;
      state.isValidated = false;
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
      state.isValidated = false;
    },
    changeSaveStatus: (state, action) => {
      state.id = action.payload.id;
      state.isSaved = action.payload.saveStatus;
    },
    changeValidation: (state, action) => {
      const { payload } = action;
      state.gain = payload.gain;
      state.tradesWon = payload.trades_win;
      state.tradesLost = payload.trades_loss;
      state.successRate = payload.success;
      state.gainsOnly = payload.gains;
      state.losesOnly = payload.loses;
      state.gainLossRate = payload.gain_loss_rate;
      state.bestGain = payload.best;
      state.worstLoss = payload.wost;
      state.drawdown = payload.drawdown;
      state.relativeDrawdown = payload.relativeDrawdown;
      state.runup = payload.runup;
      state.relativeRunup = payload.relativeRunup;
      state.image = payload.image;
      state.isValidated = true; // Strategy is now validated
    },
  },
});

export const {
  reset,
  loadStrategy,
  changeTitle,
  changeTicker,
  changeTimeframe,
  changeStartDate,
  changeEndDate,
  changeBalance,
  changeCurrency,
  changeSaveStatus,
  changeValidation,
  changeValidationStatus,
} = strategySlice.actions;
export default strategySlice.reducer;
