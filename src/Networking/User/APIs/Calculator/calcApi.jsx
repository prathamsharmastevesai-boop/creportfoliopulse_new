import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { calcEndpoint, itcalculatorEndpoint } from "../../../NWconfig";

export const calcSubmitApi = createAsyncThunk(
  "calcSubmitApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(calcEndpoint, data);
      return response.data;
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to calculate";
      return rejectWithValue(backendError);
    }
  },
);

export const commissionSimpleApi = createAsyncThunk(
  "calculator/commissionSimple",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/calc/commission_simple",
        payload,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const itcalculatorApi = createAsyncThunk(
  "calculator/itcalculatorApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(itcalculatorEndpoint, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const calculateTI = createAsyncThunk(
  "tiCalculator/calculateTI",
  async ({ sf, selectedItems, prices }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/calculate", {
        sf,
        items: selectedItems,
        custom_prices: prices,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const loadTemplates = createAsyncThunk(
  "tiCalculator/loadTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/calc/templates");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const loadTemplateById = createAsyncThunk(
  "tiCalculator/loadTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/calc/template/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const saveTemplate = createAsyncThunk(
  "tiCalculator/saveTemplate",
  async ({ building_name, sf, custom_prices }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/calc/templates", {
        building_name,
        sf,
        custom_prices,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data || err.message,
      );
    }
  },
);

export const deleteTemplate = createAsyncThunk(
  "tiCalculator/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/calc/template/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
