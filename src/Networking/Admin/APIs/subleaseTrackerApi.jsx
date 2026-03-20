import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import { subleaseEndpoint, subleasetrackerendpoint } from "../../NWconfig";

export const SubleaseTrackerSubmit = createAsyncThunk(
  "SubleaseTracker",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(subleasetrackerendpoint, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const UpdateSubleaseById = createAsyncThunk(
  "sublease/update",
  async ({ tracker_id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        subleaseEndpoint + tracker_id,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("UpdateSubleaseById Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const GetSubleaseTrackerList = createAsyncThunk(
  "SubleaseTrackerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${subleaseEndpoint}all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const GetSubleaseById = createAsyncThunk(
  "GetSubleaseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${subleaseEndpoint}${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const DeleteSubleaseById = createAsyncThunk(
  "DeleteSubleaseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${subleaseEndpoint}${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const uploadSubleaseFile = createAsyncThunk(
  "sublease/uploadFile",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/sublease/${id}/upload`,
        formData,
      );
      return response.data;
    } catch (error) {
      console.error("uploadSubleaseFile Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchSubleaseFiles = createAsyncThunk(
  "sublease/fetchFiles",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${subleaseEndpoint}${id}/files`,
      );
      return response.data;
    } catch (error) {
      console.error("fetchSubleaseFiles Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteSubleaseFile = createAsyncThunk(
  "sublease/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${subleaseEndpoint}file/${fileId}`,
      );
      return response.data;
    } catch (error) {
      console.error("deleteSubleaseFile Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
