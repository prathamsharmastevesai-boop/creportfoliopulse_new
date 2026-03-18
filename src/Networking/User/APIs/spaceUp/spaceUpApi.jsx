import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";

export const createSpace = createAsyncThunk(
  "space/create",
  async ({ buildingId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/space-up/buildings/${buildingId}/spaces`,
        payload,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  },
);

export const getSpaceUpAssginBuildings = createAsyncThunk(
  "getSpaceUpAssginBuildings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/space-up/buildings");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch buildings",
      );
    }
  },
);

export const getSpacesByBuilding = createAsyncThunk(
  "spaceUp/getSpaces",
  async (buildingId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/space-up/buildings/${buildingId}/spaces`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load spaces");
    }
  },
);

export const addProspect = createAsyncThunk(
  "spaceUp/addProspect",
  async ({ spaceId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/space-up/spaces/${spaceId}/prospects`,
        payload,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add prospect",
      );
    }
  },
);

export const getProspectsBySpace = createAsyncThunk(
  "spaceUp/getProspects",
  async (spaceId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/space-up/spaces/${spaceId}/prospects`,
      );
      return { spaceId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch prospects");
    }
  },
);

export const deleteProspect = createAsyncThunk(
  "spaceUp/deleteProspect",
  async (prospectId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/space-up/prospects/${prospectId}`);
      return prospectId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete prospect");
    }
  },
);

export const deleteSpace = createAsyncThunk(
  "spaceUp/deleteSpace",
  async (spaceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/space-up/spaces/${spaceId}`);
      return spaceId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete space");
    }
  },
);

export const getActivities = createAsyncThunk(
  "spaceUp/getActivities",
  async (prospectId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/space-up/prospects/${prospectId}/activities`,
      );
      return { prospectId, activities: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch activities",
      );
    }
  },
);

export const addActivity = createAsyncThunk(
  "spaceUp/addActivity",
  async ({ prospectId, activityType, notes }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/space-up/prospects/${prospectId}/activities`,
        { activity_type: activityType, notes },
      );
      return { prospectId, activity: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add activity");
    }
  },
);

export const deleteActivity = createAsyncThunk(
  "spaceUp/deleteActivity",
  async (activityId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/space-up/activities/${activityId}`);
      return activityId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete activity");
    }
  },
);

const getMilestoneEndpoint = (milestone) => {
  const endpoints = {
    email_outreach: "/milestones/email_outreach",
    phone_call: "/milestones/phone_call",
    requirement_confirmed: "/milestones/requirement_confirmed",
    tour_requested: "/milestones/tour_requested",
  };
  return endpoints[milestone];
};

export const addMilestone = createAsyncThunk(
  "spaceUp/addMilestone",
  async ({ prospectId, milestone, notes }, { rejectWithValue }) => {
    try {
      const endpoint = getMilestoneEndpoint(milestone);
      if (!endpoint) throw new Error(`Unknown milestone: ${milestone}`);
      const res = await axiosInstance.post(
        `/api/space-up/prospects/${prospectId}${endpoint}`,
        { notes },
      );
      return { prospectId, milestone, data: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to complete milestone",
      );
    }
  },
);
