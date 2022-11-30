import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import globalSlice from "./slices/globalSlice";
import { createWrapper } from "next-redux-wrapper";

const storeConfig = {
  preloadedState: {},
  reducer: {
    [globalSlice.name]: globalSlice,
  },
};

const makeStore = () => configureStore(storeConfig);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export default createWrapper<AppStore>(makeStore);
