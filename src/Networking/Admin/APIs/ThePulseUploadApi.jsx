import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  firmsEndpoint,
  quartersEndpoint,
  ingestEndpoint,
  publishQuarterEndpoint,
  deleteFirmEndpoint,
} from "../../NWconfig";

export const createFirmThunk = createAsyncThunk(
  "pulseUpload/createFirm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(firmsEndpoint, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating firm");
    }
  },
);

export const createQuarterThunk = createAsyncThunk(
  "pulseUpload/createQuarter",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(quartersEndpoint, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating quarter");
    }
  },
);

export const deleteQuarterThunk = createAsyncThunk(
  "pulseUpload/deleteQuarter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${quartersEndpoint}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting quarter");
    }
  },
);

export const publishQuarterThunk = createAsyncThunk(
  "pulseUpload/publishQuarter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(publishQuarterEndpoint(id));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error publishing quarter");
    }
  },
);

export const ingestDataThunk = createAsyncThunk(
  "pulseUpload/ingestData",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ingestEndpoint(id), data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error during ingestion");
    }
  },
);

export const deleteFirmThunk = createAsyncThunk(
  "pulseUpload/deleteFirm",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(deleteFirmEndpoint(id));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting firm");
    }
  },
);
