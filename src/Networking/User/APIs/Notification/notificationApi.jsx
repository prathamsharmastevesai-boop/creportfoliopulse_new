import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import {
  notificationStatusEndpoint,
  notificatioToggleEndpoint,
} from "../../../NWconfig";

export const getNotificationStatusAPI = createAsyncThunk(
  "notifications/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(notificationStatusEndpoint);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong",
      );
    }
  },
);

export const toggleNotificationStatusAPI = createAsyncThunk(
  "notifications/toggleStatus",
  async (enabled, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(notificatioToggleEndpoint, {
        enabled,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong",
      );
    }
  },
);
