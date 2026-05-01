import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";

export const submitProposalApi = createAsyncThunk(
  "loi/submitProposal",
  async ({ formData }, { rejectWithValue }) => {

    try {
      const response = await axiosInstance.post("/loi/deals/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchDealsApi = createAsyncThunk(
  "loi/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/loi/deals");

      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchThreadApi = createAsyncThunk(
  "loi/fetchThread",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/loi/deals/${dealId}/thread`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const sendMessageApi = createAsyncThunk(
  "loi/sendMessage",
  async ({ dealId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/loi/deals/${dealId}/message`,
        payload,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const downloadDocV2Api = createAsyncThunk(
  "loiAudit/downloadDocV2",
  async ({ dealId, currentVersion }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/loi/deals/${dealId}/document/v${currentVersion}`,
        {
          responseType: "blob",
        },
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Document not available yet.",
      );
    }
  },
);

export const downloadDocApi = createAsyncThunk(
  "loi/downloadDoc",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/loi/deals/${dealId}/document/v2`, {
        responseType: "blob",
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchSummaryApi = createAsyncThunk(
  "loi/fetchSummary",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/loi/deals/${dealId}/summary`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
