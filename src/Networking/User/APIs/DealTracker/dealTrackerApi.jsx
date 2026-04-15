import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { dealformEndpoint, dealList, deleteDeal } from "../../../NWconfig";

export const DealFormApi = createAsyncThunk(
  "DealFormApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(dealformEndpoint, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const DealTrackerList = createAsyncThunk(
  "DealTrackerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(dealList);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getDealTracker = createAsyncThunk(
  "getDealTracker",
  async ({ dealId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/deals/${dealId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateDealTracker = createAsyncThunk(
  "updateDealTracker",
  async ({ dealId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/deals/${dealId}`, data);

      return response.data;
    } catch (error) {
      console.error("Update deal error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const DeleteDealTracker = createAsyncThunk(
  "DeleteDealTracker",
  async ({ dealId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${deleteDeal}${dealId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Deletion failed",
      );
    }
  },
);

export const chatBotApi = createAsyncThunk(
  "ChatBotApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/database-chat/database_retrive",
        payload,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message || "Something went wrong",
      );
    }
  },
);
