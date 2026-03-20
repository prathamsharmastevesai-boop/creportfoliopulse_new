import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import {
  feedbacksubmit,
  getfeedback,
  getinfocollaborationbuildings,
} from "../../../NWconfig";

export const FeedbackSubmit = createAsyncThunk(
  "auth/FeedbackSubmit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(feedbacksubmit, formData, {});

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchBuildings = createAsyncThunk(
  "getBuildings",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getinfocollaborationbuildings, {
        params: { category: category },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const GetFeedbackList = createAsyncThunk(
  "auth/GetFeedbackList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getfeedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const UpdateFeedback = createAsyncThunk(
  "UpdateFeedback",
  async ({ id, category, building_id, form_data }, { rejectWithValue }) => {
    try {
      const data = {
        category,
        building_id: building_id,
        form_data,
      };
      const response = await axiosInstance.put(
        `/information_collaboration/admin/update/${id}`,
        data,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

export const DeleteFeedbackSubmit = createAsyncThunk(
  "DeleteFeedbackSubmit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/information_collaboration/admin/delete/${id}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const ReviewInformationCollaboration = createAsyncThunk(
  "informationCollaboration/review",
  async ({ id, decision }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/information_collaboration/review/${id}?decision=${decision}`,
        {},
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Review failed");
    }
  },
);
