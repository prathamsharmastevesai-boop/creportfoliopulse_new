import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addFloor,
  deleteFloor,
  fetchActivityLog,
  fetchBuildingDetail,
  fetchConflicts,
  fetchFloors,
  resolveConflict,
  updateFloor,
} from "../APIs/buildingStackApi";

const initialState = {
  buildings: [],
  selectedBuilding: null,
  buildingDetail: null,
  floors: [],
  activities: [],
  conflicts: [],
  loading: false,
  error: null,
  success: false,
};

const buildingStackSlice = createSlice({
  name: "buildingStackSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedBuilding: (state, action) => {
      state.selectedBuilding = action.payload;
    },
    clearBuildingDetail: (state) => {
      state.buildingDetail = null;
      state.floors = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchBuildingDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildingDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.buildingDetail = action.payload;
        state.floors = action.payload.floors || [];
      })
      .addCase(fetchBuildingDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.floors = action.payload;
      })

      .addCase(addFloor.fulfilled, (state, action) => {
        state.success = true;
        if (state.buildingDetail) {
          state.buildingDetail.floors = [
            ...(state.buildingDetail.floors || []),
            action.payload,
          ];
        }
        state.floors = [...state.floors, action.payload];
      })

      .addCase(updateFloor.fulfilled, (state, action) => {
        state.success = true;
        if (state.buildingDetail) {
          state.buildingDetail.floors = state.buildingDetail.floors.map(
            (floor) =>
              floor.id === action.payload.id ? action.payload : floor,
          );
        }
        state.floors = state.floors.map((floor) =>
          floor.id === action.payload.id ? action.payload : floor,
        );
      })

      .addCase(deleteFloor.fulfilled, (state, action) => {
        state.success = true;
        if (state.buildingDetail) {
          state.buildingDetail.floors = state.buildingDetail.floors.filter(
            (floor) => floor.id !== action.payload,
          );
        }
        state.floors = state.floors.filter(
          (floor) => floor.id !== action.payload,
        );
      })

      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.activities = action.payload;
      })

      .addCase(fetchConflicts.pending, (state) => {
        state.conflictsLoading = true;
        state.conflictsError = null;
      })
      .addCase(fetchConflicts.fulfilled, (state, action) => {
        state.conflictsLoading = false;
        state.conflicts = action.payload;
      })
      .addCase(fetchConflicts.rejected, (state, action) => {
        state.conflictsLoading = false;
        state.conflictsError = action.payload;
      })

      .addCase(resolveConflict.fulfilled, (state, action) => {
        const resolvedId = action.meta.arg.conflictId;
        state.conflicts = state.conflicts.filter((c) => c.id !== resolvedId);
      });
  },
});

export const {
  clearError,
  clearSuccess,
  setSelectedBuilding,
  clearBuildingDetail,
} = buildingStackSlice.actions;
export default buildingStackSlice.reducer;
