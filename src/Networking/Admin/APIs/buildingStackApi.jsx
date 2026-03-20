import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  buildingStackAddUnitEndpoint,
  buildingStackConflictEndpoint,
  buildingStackEndpoint,
  buildingStackMergeEndpoint,
  buildingStackUnitEndPoint,
} from "../../NWconfig";

export const fetchBuildingDetail = createAsyncThunk(
  "buildingStack/fetchBuildingDetail",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${buildingStackEndpoint}${buildingId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch building details",
      );
    }
  },
);

export const fetchFloors = createAsyncThunk(
  "buildingStack/fetchFloors",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${buildingStackEndpoint}${buildingId}/floors`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch floors");
    }
  },
);

export const addFloor = createAsyncThunk(
  "buildingStack/addFloor",
  async ({ buildingId, floorData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackEndpoint}${buildingId}/floors`,
        floorData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add floor");
    }
  },
);

export const updateFloor = createAsyncThunk(
  "buildingStack/updateFloor",
  async ({ buildingId, floorId, floorData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${buildingStackEndpoint}${buildingId}/floors/${floorId}`,
        floorData,
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue({ conflict: true, data: error.response.data });
      }
      return rejectWithValue(error.response?.data || "Failed to update floor");
    }
  },
);

export const deleteFloor = createAsyncThunk(
  "buildingStack/deleteFloor",
  async ({ buildingId, floorId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${buildingStackEndpoint}${buildingId}/floors/${floorId}`,
      );
      return floorId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete floor");
    }
  },
);

export const fetchBuildingSummary = createAsyncThunk(
  "buildingStack/fetchBuildingSummary",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${buildingStackEndpoint}${buildingId}/summary`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch summary");
    }
  },
);

export const fetchActivityLog = createAsyncThunk(
  "buildingStack/fetchActivityLog",
  async ({ buildingId, floorId = null }, { rejectWithValue }) => {
    try {
      const url = floorId
        ? `${buildingStackEndpoint}${buildingId}/floors/${floorId}/activity`
        : `${buildingStackEndpoint}${buildingId}/activity`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch activity log",
      );
    }
  },
);

export const addUnit = createAsyncThunk(
  "buildingStack/addUnit",
  async ({ floorId, unitData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackAddUnitEndpoint}${floorId}/units`,
        unitData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add unit");
    }
  },
);

export const updateUnit = createAsyncThunk(
  "buildingStack/updateUnit",
  async ({ unitId, unitData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${buildingStackUnitEndPoint}${unitId}`,
        unitData,
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue({ conflict: true, data: error.response.data });
      }
      return rejectWithValue(error.response?.data || "Failed to update unit");
    }
  },
);

export const deleteUnit = createAsyncThunk(
  "buildingStack/deleteUnit",
  async ({ unitId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${buildingStackUnitEndPoint}${unitId}`);
      return unitId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete unit");
    }
  },
);

export const splitUnit = createAsyncThunk(
  "buildingStack/splitUnit",
  async ({ unitId, splitData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackUnitEndPoint}${unitId}/split`,
        splitData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to split unit");
    }
  },
);

export const mergeUnits = createAsyncThunk(
  "buildingStack/mergeUnits",
  async ({ unit_id_a, unit_id_b }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(buildingStackMergeEndpoint, {
        unit_id_a,
        unit_id_b,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to merge units");
    }
  },
);

export const fetchConflicts = createAsyncThunk(
  "buildingStack/fetchConflicts",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${buildingStackEndpoint}${buildingId}/conflicts`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch conflicts",
      );
    }
  },
);

export const resolveConflict = createAsyncThunk(
  "buildingStack/resolveConflict",
  async ({ conflictId, chosen }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackConflictEndpoint}${conflictId}/resolve`,
        { chosen },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to resolve conflict",
      );
    }
  },
);

export const exportBuildingPDF = createAsyncThunk(
  "buildingStack/exportBuildingPDF",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${buildingStackEndpoint}${buildingId}/export`,
        {
          params: { format: "pdf" },
          responseType: "blob",
        },
      );

      const disposition = response.headers?.["content-disposition"];
      let filename = `building_${buildingId}_stack_plan.pdf`;
      if (disposition) {
        const match = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (match?.[1]) filename = match[1].replace(/['"]/g, "");
      }

      return { blob: response.data, filename };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Export failed");
    }
  },
);

export const postBuildingUpdate = createAsyncThunk(
  "buildingStack/postBuildingUpdate",
  async ({ buildingId, note }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackEndpoint}${buildingId}/updates`,
        { note },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to post update");
    }
  },
);

export const askBuildingStack = createAsyncThunk(
  "buildingStack/askBuildingStack",
  async ({ buildingId, question }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${buildingStackEndpoint}${buildingId}/ask`,
        { question },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get response");
    }
  },
);
