import { createSlice } from "@reduxjs/toolkit";
import {
  get_Threads_Api,
  getBenchmark,
  fetchLeaseOutApi,
  createLeaseOutApi,
  updateLeaseOutApi,
  deleteLeaseOutApi,
  fetchSalesFinancingApi,
  createSalesFinancingApi,
  updateSalesFinancingApi,
  deleteSalesFinancingApi,
  fetchNycFeedApi,
} from "../APIs/forumApi";

const ForumSlice = createSlice({
  name: "ForumSlice",
  initialState: {
    loading: false,
    Buliding: "",
    ThreadList: [],
    Data: {},
    error: null,

    leaseOut: {
      data: [],
      loading: false,
      error: null,
    },
    salesFinancing: {
      data: [],
      loading: false,
      error: null,
    },
    nycFeed: {
      data: null,
      loading: false,
      error: null,
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(get_Threads_Api.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_Threads_Api.fulfilled, (state, action) => {
        state.loading = false;
        state.ThreadList = action.payload;
      })
      .addCase(get_Threads_Api.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getBenchmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBenchmark.fulfilled, (state, action) => {
        state.loading = false;
        state.Data = action.payload;
      })
      .addCase(getBenchmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchLeaseOutApi.pending, (state) => {
        state.leaseOut.loading = true;
        state.leaseOut.error = null;
      })
      .addCase(fetchLeaseOutApi.fulfilled, (state, action) => {
        state.leaseOut.loading = false;
        state.leaseOut.data = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchLeaseOutApi.rejected, (state, action) => {
        state.leaseOut.loading = false;
        state.leaseOut.error = action.payload;
      });

    builder
      .addCase(createLeaseOutApi.pending, (state) => {
        state.leaseOut.loading = true;
        state.leaseOut.error = null;
      })
      .addCase(createLeaseOutApi.fulfilled, (state) => {
        state.leaseOut.loading = false;
      })
      .addCase(createLeaseOutApi.rejected, (state, action) => {
        state.leaseOut.loading = false;
        state.leaseOut.error = action.payload;
      });

    builder
      .addCase(updateLeaseOutApi.pending, (state) => {
        state.leaseOut.loading = true;
        state.leaseOut.error = null;
      })
      .addCase(updateLeaseOutApi.fulfilled, (state) => {
        state.leaseOut.loading = false;
      })
      .addCase(updateLeaseOutApi.rejected, (state, action) => {
        state.leaseOut.loading = false;
        state.leaseOut.error = action.payload;
      });

    builder
      .addCase(deleteLeaseOutApi.fulfilled, (state, action) => {
        state.leaseOut.data = state.leaseOut.data.filter(
          (r) => r.id !== action.payload.id,
        );
      })
      .addCase(deleteLeaseOutApi.rejected, (state, action) => {
        state.leaseOut.error = action.payload;
      });

    builder
      .addCase(fetchSalesFinancingApi.pending, (state) => {
        state.salesFinancing.loading = true;
        state.salesFinancing.error = null;
      })
      .addCase(fetchSalesFinancingApi.fulfilled, (state, action) => {
        state.salesFinancing.loading = false;
        state.salesFinancing.data = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchSalesFinancingApi.rejected, (state, action) => {
        state.salesFinancing.loading = false;
        state.salesFinancing.error = action.payload;
      });

    builder
      .addCase(createSalesFinancingApi.pending, (state) => {
        state.salesFinancing.loading = true;
        state.salesFinancing.error = null;
      })
      .addCase(createSalesFinancingApi.fulfilled, (state) => {
        state.salesFinancing.loading = false;
      })
      .addCase(createSalesFinancingApi.rejected, (state, action) => {
        state.salesFinancing.loading = false;
        state.salesFinancing.error = action.payload;
      });

    builder
      .addCase(updateSalesFinancingApi.pending, (state) => {
        state.salesFinancing.loading = true;
        state.salesFinancing.error = null;
      })
      .addCase(updateSalesFinancingApi.fulfilled, (state) => {
        state.salesFinancing.loading = false;
      })
      .addCase(updateSalesFinancingApi.rejected, (state, action) => {
        state.salesFinancing.loading = false;
        state.salesFinancing.error = action.payload;
      });

    builder
      .addCase(deleteSalesFinancingApi.fulfilled, (state, action) => {
        state.salesFinancing.data = state.salesFinancing.data.filter(
          (r) => r.id !== action.payload.id,
        );
      })
      .addCase(deleteSalesFinancingApi.rejected, (state, action) => {
        state.salesFinancing.error = action.payload;
      });

    builder
      .addCase(fetchNycFeedApi.pending, (state) => {
        state.nycFeed.loading = true;
        state.nycFeed.error = null;
      })
      .addCase(fetchNycFeedApi.fulfilled, (state, action) => {
        state.nycFeed.loading = false;
        state.nycFeed.data = action.payload;
      })
      .addCase(fetchNycFeedApi.rejected, (state, action) => {
        state.nycFeed.loading = false;
        state.nycFeed.error = action.payload;
      });
  },
});

export default ForumSlice.reducer;
