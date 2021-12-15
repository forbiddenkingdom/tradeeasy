import { configureStore } from "@reduxjs/toolkit";
import undoable from "redux-undo";
import strategyReducer from "./reducers/strategy.reducer";
import builder from "./reducers/builder.reducer";

export default configureStore({
  reducer: {
    strategy: strategyReducer,
    builder: undoable(builder),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable non-serializable value in state error
    }),
});
