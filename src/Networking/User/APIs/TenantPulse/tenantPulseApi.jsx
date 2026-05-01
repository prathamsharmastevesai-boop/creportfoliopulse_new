import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";

export const getFollowingCompanies = createAsyncThunk(
  "tenantPulse/getFollowingCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tenant-pulse/following");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const followCompany = createAsyncThunk(
  "tenantPulse/followCompany",
  async (companyName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tenant-pulse/follow", {
        company_name: companyName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowCompany = createAsyncThunk(
  "tenantPulse/unfollowCompany",
  async (companyName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/tenant-pulse/unfollow?company_name=${encodeURIComponent(companyName)}`
      );
      return { ...response.data, company_name: companyName };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTenantFeed = createAsyncThunk(
  "tenantPulse/getTenantFeed",
  async ({ page = 1, page_size = 20, company_name = "" } = {}, { rejectWithValue }) => {
    try {
      let url = `/tenant-pulse/feed?page=${page}&page_size=${page_size}`;
      if (company_name) {
        url += `&company_name=${encodeURIComponent(company_name)}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
