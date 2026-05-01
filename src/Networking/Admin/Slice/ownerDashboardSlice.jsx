import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTimsCategories,
  fetchTimsList,
  fetchCompsCategories,
  fetchCompsList,
  fetchDctSummary,
  fetchDetSummary,
} from "../APIs/OwnerDashboard/ownerDashboardApi";

const ownerDashboardSlice = createSlice({
  name: "ownerDashboard",
  initialState: {
    timsCategories: [],
    timsList: [],
    timsSummary: null,
    compsCategories: [],
    compsList: [],
    compsSummary: null,
    dctSummary: null,
    detSummary: null,
    loading: false,
    timsLoading: false,
    compsLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    builder.addCase(fetchTimsCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTimsCategories.fulfilled, (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.timsCategories = action.payload;
      } else if (action.payload && typeof action.payload === "object") {
        state.timsCategories = action.payload.categories || [];
        const { categories, ...metrics } = action.payload;
        state.timsSummary = metrics;
      }
    });
    builder.addCase(fetchTimsCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
    builder.addCase(fetchTimsList.pending, (state) => {
      state.timsLoading = true;
    });
    builder.addCase(fetchTimsList.fulfilled, (state, action) => {
      state.timsLoading = false;
      state.timsList = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchTimsList.rejected, (state, action) => {
      state.timsLoading = false;
      state.error = action.payload;
    });

   
    builder.addCase(fetchCompsCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCompsCategories.fulfilled, (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.compsCategories = action.payload;
      } else if (action.payload && typeof action.payload === "object") {
        state.compsCategories = action.payload.categories || [];
        const { categories, ...metrics } = action.payload;
        state.compsSummary = metrics;
      }
    });
    builder.addCase(fetchCompsCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
    builder.addCase(fetchCompsList.pending, (state) => {
      state.compsLoading = true;
    });
    builder.addCase(fetchCompsList.fulfilled, (state, action) => {
      state.compsLoading = false;
      state.compsList = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchCompsList.rejected, (state, action) => {
      state.compsLoading = false;
      state.error = action.payload;
    });

   
    builder.addCase(fetchDctSummary.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDctSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.dctSummary = action.payload;
    });
    builder.addCase(fetchDctSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  
    builder.addCase(fetchDetSummary.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDetSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.detSummary = action.payload;
    });
    builder.addCase(fetchDetSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = ownerDashboardSlice.actions;
export default ownerDashboardSlice.reducer;
