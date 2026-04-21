import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSources,
  fetchFirms,
  fetchQuarters,
  fetchQuarterOverview,
  fetchSubmarkets,
  fetchTransactions,
} from "./thePulseApi";

const initialState = {
  firms: [],
  quarters: [],
  overview: null,
  submarkets: [],
  transactions: [],
  sources: [],
  loading: false,
  loadingCount: 0,
  error: null,
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loadingCount += 1;
      state.loading = true;
      state.error = null;
    };
    const setSettled = (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      state.loading = state.loadingCount > 0;
    };
    const setRejected = (state, action) => {
      setSettled(state);
      state.error = action.payload || "An error occurred";
    };

    builder

      .addCase(fetchFirms.pending, setPending)
      .addCase(fetchFirms.fulfilled, (state, action) => {
        setSettled(state);
        state.firms = action.payload;
      })
      .addCase(fetchFirms.rejected, setRejected)

      .addCase(fetchQuarters.pending, setPending)
      .addCase(fetchQuarters.fulfilled, (state, action) => {
        setSettled(state);
        state.quarters = action.payload;
      })
      .addCase(fetchQuarters.rejected, setRejected)

      .addCase(fetchQuarterOverview.pending, setPending)
      .addCase(fetchQuarterOverview.fulfilled, (state, action) => {
        setSettled(state);
        state.overview = action.payload;
      })
      .addCase(fetchQuarterOverview.rejected, setRejected)

      .addCase(fetchSubmarkets.pending, setPending)
      .addCase(fetchSubmarkets.fulfilled, (state, action) => {
        setSettled(state);
        state.submarkets = action.payload;
      })
      .addCase(fetchSubmarkets.rejected, setRejected)

      .addCase(fetchTransactions.pending, setPending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        setSettled(state);
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, setRejected)

      .addCase(fetchSources.pending, setPending)
      .addCase(fetchSources.fulfilled, (state, action) => {
        setSettled(state);
        state.sources = action.payload;
      })
      .addCase(fetchSources.rejected, setRejected);
  },
});

export default marketSlice.reducer;
