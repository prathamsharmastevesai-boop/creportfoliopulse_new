import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  CreateBuilding,
  DeleteBuildingEndpoint,
  ListBuilding,
  UpdateBuildingEndpoint,
} from "../../NWconfig";

export const CreateBuildingSubmit = createAsyncThunk(
  "auth/CreateBuildingSubmit",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("address", payload.address);

      if (payload.category) {
        formData.append("category", payload.category);
      }

      if (payload.current_occupancy) {
        formData.append("current_occupancy", payload.current_occupancy);
      }

      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await axiosInstance.post(CreateBuilding, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const ListBuildingSubmit = createAsyncThunk(
  "auth/ListBuildingSubmit",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ListBuilding, {
        params: category === "workletter" ? { category } : {},
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const ListuserBuildingSubmit = createAsyncThunk(
  "auth/ListBuildingSubmit",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ListBuilding, {
        params: { category },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const UpdateBuildingSubmit = createAsyncThunk(
  "auth/UpdateBuildingSubmit",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("building_id", payload.building_id);
      formData.append("address", payload.address);

      if (payload.category) {
        formData.append("category", payload.category);
      }

      if (payload.current_occupancy) {
        formData.append("current_occupancy", payload.current_occupancy);
      }

      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await axiosInstance.patch(
        UpdateBuildingEndpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error.response);
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const DeleteBuilding = createAsyncThunk(
  "auth/DeleteBuilding",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(DeleteBuildingEndpoint, {
        params: { building_id: id },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
