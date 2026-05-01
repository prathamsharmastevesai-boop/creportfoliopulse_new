import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../AxiosInstance";
import {
  pulseCompsCategories,
  pulseCompsList,
  pulseTimsCategories,
  pulseTimsList,
  pulseDctSummary,
  pulseDetSummary,
} from "../../../NWconfig";

export const fetchTimsCategories = createAsyncThunk(
  "ownerDashboard/fetchTimsCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pulseTimsCategories);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch TIMs categories");
    }
  }
);

export const fetchTimsList = createAsyncThunk(
  "ownerDashboard/fetchTimsList",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${pulseTimsList}?status=${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch TIMs list");
    }
  }
);

export const fetchCompsCategories = createAsyncThunk(
  "ownerDashboard/fetchCompsCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pulseCompsCategories);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch COMPs categories");
    }
  }
);

export const fetchCompsList = createAsyncThunk(
  "ownerDashboard/fetchCompsList",
  async (submarket, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${pulseCompsList}?submarket=${encodeURIComponent(submarket)}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch COMPs list");
    }
  }
);

export const fetchDctSummary = createAsyncThunk(
  "ownerDashboard/fetchDctSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pulseDctSummary);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch DCT summary");
    }
  }
);

export const fetchDetSummary = createAsyncThunk(
  "ownerDashboard/fetchDetSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pulseDetSummary);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch DET summary");
    }
  }
);
