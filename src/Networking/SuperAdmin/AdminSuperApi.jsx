import { createAsyncThunk } from "@reduxjs/toolkit";
import { inviteAdmin, listAdmin } from "../NWconfig";
import axiosInstance from "../Admin/APIs/AxiosInstance";

export const inviteAdminApi = createAsyncThunk(
  "inviteAdminApi",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(inviteAdmin, credentials);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getAdminlistApi = createAsyncThunk(
  "getAdminlistApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(listAdmin);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchAdminStatsApi = createAsyncThunk(
  "admin/fetchStats",
  async (company_id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `/admin/stats?company_id=${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch admin stats",
      );
    }
  },
);

export const fetchAdminAnalyticsApi = createAsyncThunk(
  "admin/fetchAnalytics",
  async ({ company_id, days = 7 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        `/admin/analytics?days=${days}&company_id=${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch admin analytics",
      );
    }
  },
);

export const getCompanyMembersApi = createAsyncThunk(
  "superAdmin/getCompanyMembers",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/auth/company/${companyId}/members`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch company members",
      );
    }
  },
);

export const transferOwnershipApi = createAsyncThunk(
  "admin/transferOwnership",
  async ({ company_id, new_owner_email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/auth/company/${company_id}/transfer-ownership`,
        {
          new_owner_email,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Transfer failed",
      );
    }
  },
);
