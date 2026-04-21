import { createSlice } from "@reduxjs/toolkit";
import {
  createFirmThunk,
  createQuarterThunk,
  deleteQuarterThunk,
  publishQuarterThunk,
  ingestDataThunk,
  deleteFirmThunk,
} from "../Admin/APIs/ThePulseUploadApi";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const pulseUploadSlice = createSlice({
  name: "pulseUpload",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    };
    const setFulfilled = (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
      state.success = false;
    };

    builder
      .addCase(createFirmThunk.pending, setPending)
      .addCase(createFirmThunk.fulfilled, setFulfilled)
      .addCase(createFirmThunk.rejected, setRejected)

      .addCase(createQuarterThunk.pending, setPending)
      .addCase(createQuarterThunk.fulfilled, setFulfilled)
      .addCase(createQuarterThunk.rejected, setRejected)

      .addCase(deleteQuarterThunk.pending, setPending)
      .addCase(deleteQuarterThunk.fulfilled, setFulfilled)
      .addCase(deleteQuarterThunk.rejected, setRejected)

      .addCase(publishQuarterThunk.pending, setPending)
      .addCase(publishQuarterThunk.fulfilled, setFulfilled)
      .addCase(publishQuarterThunk.rejected, setRejected)

      .addCase(ingestDataThunk.pending, setPending)
      .addCase(ingestDataThunk.fulfilled, setFulfilled)
      .addCase(ingestDataThunk.rejected, setRejected)

      .addCase(deleteFirmThunk.pending, setPending)
      .addCase(deleteFirmThunk.fulfilled, setFulfilled)
      .addCase(deleteFirmThunk.rejected, setRejected);
  },
});

export const { resetUploadState } = pulseUploadSlice.actions;
export default pulseUploadSlice.reducer;
