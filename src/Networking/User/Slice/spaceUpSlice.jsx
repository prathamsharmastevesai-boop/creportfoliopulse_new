import { createSlice } from "@reduxjs/toolkit";
import {
  addProspect,
  createSpace,
  getSpacesByBuilding,
  getSpaceUpAssginBuildings,
  getProspectsBySpace,
  deleteSpace,
} from "../APIs/spaceUp/spaceUpApi";

const spaceUpSlice = createSlice({
  name: "spaceUpSlice",

  initialState: {
    loading: false,
    success: false,
    error: null,

    deletingSpaceId: null,
    spaces: [],
    spacesLoading: false,

    buildingList: [],
    buildingLoading: false,

    prospects: [],
    prospectsLoading: false,

    prospectLoading: false,
    prospectSuccess: false,
    prospectError: null,
  },

  reducers: {
    resetSpaceState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

    resetProspectState: (state) => {
      state.prospectLoading = false;
      state.prospectSuccess = false;
      state.prospectError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSpace.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpaceUpAssginBuildings.pending, (state) => {
        state.buildingLoading = true;
      })
      .addCase(getSpaceUpAssginBuildings.fulfilled, (state, action) => {
        state.buildingLoading = false;
        state.buildingList = action.payload || [];
      })
      .addCase(getSpaceUpAssginBuildings.rejected, (state, action) => {
        state.buildingLoading = false;
        state.error = action.payload;
      })

      .addCase(getProspectsBySpace.pending, (state) => {
        state.prospectsLoading = true;
      })
      .addCase(getProspectsBySpace.fulfilled, (state, action) => {
        state.prospectsLoading = false;
        state.prospects = action.payload || [];
      })
      .addCase(getProspectsBySpace.rejected, (state) => {
        state.prospectsLoading = false;
      })

      .addCase(addProspect.pending, (state) => {
        state.prospectLoading = true;
        state.prospectSuccess = false;
      })
      .addCase(addProspect.fulfilled, (state, action) => {
        state.prospectLoading = false;
        state.prospectSuccess = true;
        if (action.payload) {
          state.prospects.push(action.payload);
        }
      })
      .addCase(addProspect.rejected, (state, action) => {
        state.prospectLoading = false;
        state.prospectError = action.payload;
      })

      .addCase(deleteSpace.pending, (state, action) => {
        state.deletingSpaceId = action.meta.arg;
      })
      .addCase(deleteSpace.fulfilled, (state, action) => {
        state.deletingSpaceId = null;
        state.spaces = state.spaces.filter(
          (space) => space.id !== action.payload,
        );
      })
      .addCase(deleteSpace.rejected, (state, action) => {
        state.deletingSpaceId = null;
        state.error = action.payload;
      });
  },
});

export const { resetSpaceState, resetProspectState } = spaceUpSlice.actions;
export default spaceUpSlice.reducer;
