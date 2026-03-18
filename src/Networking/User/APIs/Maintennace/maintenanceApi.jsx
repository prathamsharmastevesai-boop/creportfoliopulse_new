import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { toast } from "react-toastify";

const MAINTENANCE_BASE = (buildingId) =>
  `/features/building/${buildingId}/maintenance`;
const PULSE_BASE = `/features/pulse-reports`;

export const fetchMaintenanceItems = createAsyncThunk(
  "maintenance/fetchAll",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(MAINTENANCE_BASE(buildingId));
      const d = response.data;
      return Array.isArray(d) ? d : d.data || d.maintenance || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const createMaintenanceItem = createAsyncThunk(
  "maintenance/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/features/maintenance`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const updateMaintenanceItem = createAsyncThunk(
  "maintenance/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/features/maintenance/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const deleteMaintenanceItem = createAsyncThunk(
  "maintenance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/features/maintenance/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchMaintenanceHistory = createAsyncThunk(
  "maintenance/fetchHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/features/maintenance/${id}/history`,
      );
      const d = response.data;
      return Array.isArray(d) ? d : d.history || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchPulseReports = createAsyncThunk(
  "pulse/fetchAll",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(PULSE_BASE, {
        params: { building_id: buildingId },
      });
      const d = response.data;
      return Array.isArray(d) ? d : d.data || d.reports || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const createPulseReport = createAsyncThunk(
  "pulse/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(PULSE_BASE, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const updatePulseReport = createAsyncThunk(
  "pulse/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${PULSE_BASE}/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchSubscriptions = createAsyncThunk(
  "subscription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/features/subscriptions");
      const d = response.data;
      return Array.isArray(d) ? d : d.data || d.subscriptions || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async ({ building_id, section }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/features/subscriptions", {
        building_id,
        section,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
