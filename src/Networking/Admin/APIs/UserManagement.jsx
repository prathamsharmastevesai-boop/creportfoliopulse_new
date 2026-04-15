import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";

import { InviteUser, userList, ToggleGemini } from "../../NWconfig";

export const inviteUserApi = createAsyncThunk(
  "auth/inviteUserApi",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(InviteUser, credentials);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to invite user",
      );
    }
  },
);

export const getUserlistApi = createAsyncThunk(
  "auth/getUserlistApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(userList);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user list",
      );
    }
  },
);

export const toggleGeminiApi = createAsyncThunk(
  "user/toggleGeminiApi",
  async ({ email, enable }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        ToggleGemini + `?email=${email}&enable=${enable}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle Gemini",
      );
    }
  },
);

export const getBuildingPermissionsApi = createAsyncThunk(
  "buildings/getPermissions",
  async ({ email, category }, { rejectWithValue }) => {
    try {
      const encodedEmail = encodeURIComponent(email);

      const response = await axiosInstance.get(
        `/users/${encodedEmail}/building-permissions`,
        {
          params: { category },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  },
);

export const updateBuildingPermissionApi = createAsyncThunk(
  "buildings/updatePermission",
  async ({ email, category, permissions }, { rejectWithValue }) => {
    try {
      const encodedEmail = encodeURIComponent(email);

      const payload = {
        category,
        permissions,
      };

      console.log("PATCH URL:", `/users/${encodedEmail}/building-permissions`);
      console.log("PATCH Payload:", payload);

      const response = await axiosInstance.patch(
        `/users/${encodedEmail}/building-permissions`,
        payload,
      );

      return response.data;
    } catch (error) {
      console.error("UPDATE BUILDING PERMISSION ERROR:", error?.response?.data);

      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          JSON.stringify(error?.response?.data) ||
          error?.message ||
          "Something went wrong",
      );
    }
  },
);
