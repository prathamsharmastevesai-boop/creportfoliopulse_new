import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";

export const assignBuilding = createAsyncThunk(
  "building/assign",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/space-up/buildings/assign",
        payload,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Assign failed");
    }
  },
);

export const removeUserFromBuilding = createAsyncThunk(
  "building/removeUser",
  async ({ buildingId, userId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/api/space-up/buildings/${buildingId}/users/${userId}`,
      );
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Remove failed");
    }
  },
);
