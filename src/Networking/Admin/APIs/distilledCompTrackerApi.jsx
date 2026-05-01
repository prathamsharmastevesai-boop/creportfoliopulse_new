import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  AskQuestionDCTEndpoint,
  distilledBenchmarkEndpoint,
  distilledCompTrackerEndpoint,
  distilledCompTrackerlistEndPoint,
  updateDCTCompEndpoint,
  deleteDCTCompEndpoint,
} from "../../NWconfig";

export const distilledCompTracker = createAsyncThunk(
  "distilledCompTracker",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        distilledCompTrackerEndpoint,
        payload,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getdistilledCompTrackerlistApi = createAsyncThunk(
  "getdistilledCompTrackerlistApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        distilledCompTrackerlistEndPoint,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const AskQuestionDCTAPI = createAsyncThunk(
  "AskQuestionDCTAPI",
  async ({ question }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AskQuestionDCTEndpoint, {
        question,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const distilledBenchmarkApi = createAsyncThunk(
  "distilledBenchmarkApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        distilledBenchmarkEndpoint,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getDCTComp = createAsyncThunk(
  "getDCTComp",
  async (compId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${updateDCTCompEndpoint}${compId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateDCTComp = createAsyncThunk(
  "updateDCTComp",
  async ({ compId, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${updateDCTCompEndpoint}${compId}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteDCTComp = createAsyncThunk(
  "deleteDCTComp",
  async (compId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${deleteDCTCompEndpoint}${compId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
