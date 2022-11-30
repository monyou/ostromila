import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import type { AppState } from "../store";

type GlobalState = {
  loading: boolean;
};

const initialState = {
  loading: false,
} as GlobalState;

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading(state, { payload }: { payload: boolean }) {
      state.loading = payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      const nextState = {
        ...state,
        ...action.payload.global,
      };
      return nextState;
    },
  },
});

// Thunks

// Selectors
export const selectGlobalLoading = (state: AppState) => state?.global?.loading;

// Actions and Reducer
export const { setLoading } = globalSlice.actions;
export default globalSlice.reducer;
