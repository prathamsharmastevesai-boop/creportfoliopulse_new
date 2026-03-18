import { createSlice } from "@reduxjs/toolkit";
import {
  createMaintenanceItem,
  createPulseReport,
  createSubscription,
  deleteMaintenanceItem,
  fetchMaintenanceHistory,
  fetchMaintenanceItems,
  fetchPulseReports,
  fetchSubscriptions,
  updateMaintenanceItem,
  updatePulseReport,
} from "../APIs/Maintennace/maintenanceApi";

const maintenanceSlice = createSlice({
  name: "maintenanceSlice",
  initialState: {
    maintenanceItems: [],
    maintenanceLoading: false,
    maintenanceError: null,

    maintenanceHistory: {},
    historyLoading: false,
    historyError: null,

    pulseReports: [],
    pulseLoading: false,
    pulseError: null,

    subscriptions: [],
    subscriptionsLoading: false,
    subscriptionsError: null,
  },
  reducers: {
    createMaintenace: (state, action) => {
      const { building_id, entry_id, ...rest } = action.payload;

      state.maintenanceItems.push({ id: entry_id, building_id, ...rest });
    },
    updateMaintenace: (state, action) => {
      const { building_id, entry_id, ...updates } = action.payload;
      const index = state.maintenanceItems.findIndex(
        (item) => item.id === entry_id && item.building_id === building_id,
      );
      if (index !== -1) {
        state.maintenanceItems[index] = {
          ...state.maintenanceItems[index],
          ...updates,
        };
      }
    },
    deleteMaintenace: (state, action) => {
      const { building_id, entry_id } = action.payload;
      state.maintenanceItems = state.maintenanceItems.filter(
        (item) => !(item.id === entry_id && item.building_id === building_id),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenanceItems.pending, (state) => {
        state.maintenanceLoading = true;
        state.maintenanceError = null;
      })
      .addCase(fetchMaintenanceItems.fulfilled, (state, action) => {
        state.maintenanceLoading = false;
        state.maintenanceItems = action.payload;
      })
      .addCase(fetchMaintenanceItems.rejected, (state, action) => {
        state.maintenanceLoading = false;
        state.maintenanceError = action.payload;
      })
      .addCase(createMaintenanceItem.fulfilled, (state, action) => {
        if (action.payload) {
          state.maintenanceItems.push(action.payload);
        }
      })
      .addCase(updateMaintenanceItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.maintenanceItems.findIndex(
          (item) => item.id === updated.id,
        );
        if (index !== -1) {
          state.maintenanceItems[index] = updated;
        }
      })
      .addCase(deleteMaintenanceItem.fulfilled, (state, action) => {
        state.maintenanceItems = state.maintenanceItems.filter(
          (item) => item.id !== action.payload,
        );
      })

      .addCase(fetchMaintenanceHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchMaintenanceHistory.fulfilled, (state, action) => {
        state.historyLoading = false;

        state.maintenanceHistory = action.payload;
      })
      .addCase(fetchMaintenanceHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      .addCase(fetchPulseReports.pending, (state) => {
        state.pulseLoading = true;
        state.pulseError = null;
      })
      .addCase(fetchPulseReports.fulfilled, (state, action) => {
        state.pulseLoading = false;
        state.pulseReports = action.payload;
      })
      .addCase(fetchPulseReports.rejected, (state, action) => {
        state.pulseLoading = false;
        state.pulseError = action.payload;
      })
      .addCase(createPulseReport.fulfilled, (state, action) => {
        if (action.payload) {
          state.pulseReports.push(action.payload);
        }
      })
      .addCase(updatePulseReport.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.pulseReports.findIndex(
          (report) => report.id === updated.id,
        );
        if (index !== -1) {
          state.pulseReports[index] = updated;
        }
      })

      .addCase(fetchSubscriptions.pending, (state) => {
        state.subscriptionsLoading = true;
        state.subscriptionsError = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.subscriptionsLoading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.subscriptionsLoading = false;
        state.subscriptionsError = action.payload;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        if (action.payload) {
          state.subscriptions.push(action.payload);
        }
      });
  },
});

export const { createMaintenace, updateMaintenace, deleteMaintenace } =
  maintenanceSlice.actions;

export default maintenanceSlice.reducer;
