import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";

const TOUR_ENDPOINT = "/calendar-tours/";

export const fetchToursApi = createAsyncThunk(
  "tours/fetchToursApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TOUR_ENDPOINT);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createTourApi = createAsyncThunk(
  "tours/createTourApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(TOUR_ENDPOINT, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateTourApi = createAsyncThunk(
  "tours/updateTourApi",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${TOUR_ENDPOINT}${id}`,
        payload,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteTourApi = createAsyncThunk(
  "tours/deleteTourApi",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${TOUR_ENDPOINT}${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
