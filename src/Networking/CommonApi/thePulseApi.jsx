import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Admin/APIs/AxiosInstance";

const BASE_URL = "/market_intelligence";

export const fetchFirms = createAsyncThunk(
  "market/fetchFirms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/firms`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching firms");
    }
  },
);

export const fetchQuarters = createAsyncThunk(
  "market/fetchQuarters",
  async (firmId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/market_intelligence/quarters`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching quarters");
    }
  },
);

export const fetchQuarterOverview = createAsyncThunk(
  "market/fetchOverview",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/quarters/${id}/overview`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching overview");
    }
  },
);

export const fetchSubmarkets = createAsyncThunk(
  "market/fetchSubmarkets",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/quarters/${id}/submarkets`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching submarkets");
    }
  },
);

export const fetchTransactions = createAsyncThunk(
  "market/fetchTransactions",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/quarters/${id}/transactions`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error fetching transactions",
      );
    }
  },
);

export const fetchSources = createAsyncThunk(
  "market/fetchSources",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${BASE_URL}/quarters/${id}/sources`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching sources");
    }
  },
);
