import { createSlice } from "@reduxjs/toolkit";
import {
  createTourApi,
  deleteTourApi,
  fetchToursApi,
  updateTourApi,
} from "../APIs/calendar/calendarApi";

const initialState = {
  tours: [],

  fetchLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
};

const calendarSlice = createSlice({
  name: "calendarSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToursApi.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchToursApi.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursApi.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createTourApi.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTourApi.fulfilled, (state, action) => {
        state.createLoading = false;
        state.tours.unshift(action.payload);
      })
      .addCase(createTourApi.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateTourApi.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateTourApi.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.tours.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tours[idx] = action.payload;
      })
      .addCase(updateTourApi.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteTourApi.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteTourApi.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.tours = state.tours.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTourApi.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = calendarSlice.actions;
export default calendarSlice.reducer;
