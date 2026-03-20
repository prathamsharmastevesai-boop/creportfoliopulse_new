import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { Tours } from "../../../NWconfig";

const getErrorMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.response?.data?.detail || fallback;

export const toursCreateSubmit = createAsyncThunk(
  "toursCreateSubmit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(Tours, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const UpdateToursSubmit = createAsyncThunk(
  "tours/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`${Tours}${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const GeToursList = createAsyncThunk(
  "GeToursList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(Tours);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  },
);

export const DeleteToursSubmit = createAsyncThunk(
  "DeleteToursSubmit",
  async (tour_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${Tours}${tour_id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
