import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  compliancelogEndpoint,
  complianceStatesEndpoint,
  dashboardData,
  SystemTracing,
} from "../../NWconfig";

export const getdashboardApi = createAsyncThunk(
  "auth/getdashboardApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(dashboardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getsystemtracingApi = createAsyncThunk(
  "auth/getsystemtracingApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(SystemTracing);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getComplianceStatsApi = createAsyncThunk(
  "auth/getComplianceLogsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(complianceStatesEndpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getComplianceLogsApi = createAsyncThunk(
  "auth/getComplianceLogsApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(compliancelogEndpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
