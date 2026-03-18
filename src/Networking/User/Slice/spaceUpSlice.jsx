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

    prospectsBySpace: {},
    prospectsLoading: {},

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

      .addCase(getSpacesByBuilding.pending, (state) => {
        state.spacesLoading = true;
      })
      .addCase(getSpacesByBuilding.fulfilled, (state, action) => {
        state.spacesLoading = false;
        state.spaces = action.payload || [];
      })
      .addCase(getSpacesByBuilding.rejected, (state) => {
        state.spacesLoading = false;
      })

      .addCase(getProspectsBySpace.pending, (state, action) => {
        const spaceId = action.meta.arg;
        state.prospectsLoading[spaceId] = true;
      })

      .addCase(getProspectsBySpace.fulfilled, (state, action) => {
        const { spaceId, data } = action.payload;

        state.prospectsLoading[spaceId] = false;
        state.prospectsBySpace[spaceId] = data || [];
      })

      .addCase(getProspectsBySpace.rejected, (state, action) => {
        const spaceId = action.meta.arg;
        state.prospectsLoading[spaceId] = false;
      })

      .addCase(addProspect.pending, (state) => {
        state.prospectLoading = true;
        state.prospectSuccess = false;
      })

      .addCase(addProspect.fulfilled, (state, action) => {
        state.prospectLoading = false;
        state.prospectSuccess = true;

        const { spaceId, data } = action.payload || {};

        if (spaceId && state.prospectsBySpace[spaceId]) {
          state.prospectsBySpace[spaceId].push(data);
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
