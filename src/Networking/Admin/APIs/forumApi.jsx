import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  benchmarkEndpoint,
  createThreadEndpoint,
  thread,
  threadData,
  ToggleForum,
} from "../../NWconfig";

export const get_Threads_Api = createAsyncThunk(
  "get_Threads_Api",
  async (post_type = null, { rejectWithValue }) => {
    try {
      const params = post_type ? { post_type } : {};
      const response = await axiosInstance.get(threadData, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createThread = createAsyncThunk(
  "threads/createThread",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.content) formData.append("content", payload.content);
      if (payload.post_type) formData.append("post_type", payload.post_type);
      if (payload.file) formData.append("file", payload.file);
      const response = await axiosInstance.post(
        createThreadEndpoint,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const getThreadhistory = createAsyncThunk(
  "getThreadhistory",
  async (thread_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${thread}${thread_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteThreadsApi = createAsyncThunk(
  "deleteThreadsApi",
  async ({ thread_id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${thread}${thread_id}`);
      return { thread_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const reactToThreadApi = createAsyncThunk(
  "reactToThreadApi",
  async ({ thread_id, reaction }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("reaction", reaction);
      const response = await axiosInstance.post(
        `${thread}${thread_id}/react`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return { thread_id, reaction, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createThoughtApi = createAsyncThunk(
  "forum/createThought",
  async ({ thread_id, data }, { rejectWithValue }) => {
    try {
      let formData;
      if (data instanceof FormData) {
        formData = data;
      } else {
        formData = new FormData();
        if (data.content) formData.append("content", data.content);
        if (data.file) formData.append("file", data.file);
      }
      const response = await axiosInstance.post(
        `${thread}${thread_id}/thoughts`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateThoughtApi = createAsyncThunk(
  "updateThoughtApi",
  async ({ thread_id, thought_id, data }, { rejectWithValue }) => {
    try {
      let formData;
      if (data instanceof FormData) {
        formData = data;
      } else {
        formData = new FormData();
        if (data.content) formData.append("content", data.content);
        if (data.file) formData.append("file", data.file);
        if (data.keep_existing_file)
          formData.append("keep_existing_file", "true");
      }
      const response = await axiosInstance.patch(
        `${thread}${thread_id}/thoughts/${thought_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteThoughtApi = createAsyncThunk(
  "deleteThoughtApi",
  async ({ thread_id, thought_id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `${thread}${thread_id}/thoughts/${thought_id}`,
      );
      return { thread_id, thought_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const toggleForumApi = createAsyncThunk(
  "toggleForumApi",
  async ({ email, enable }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${ToggleForum}?email=${email}&enable=${enable}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle Forum",
      );
    }
  },
);

export const toggleUserFeaturesApi = createAsyncThunk(
  "toggleUserFeaturesApi",
  async ({ email, features }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/feature_toggle/${email}`,
        features,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user features",
      );
    }
  },
);

export const getBenchmark = createAsyncThunk(
  "det/getBenchmark",
  async ({ sf_band, submarket, building_class }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(benchmarkEndpoint, {
        params: { sf_band, submarket, building_class },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch benchmark",
      );
    }
  },
);

export const updateThreadApi = createAsyncThunk(
  "updateThreadApi",
  async ({ thread_id, data }, { rejectWithValue }) => {
    try {
      let formData;
      if (data instanceof FormData) {
        formData = data;
      } else {
        formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.content) formData.append("content", data.content);
        if (data.post_type) formData.append("post_type", data.post_type);
        if (data.file) formData.append("file", data.file);
        if (data.keep_existing_file)
          formData.append("keep_existing_file", "true");
        if (data.remove_file) formData.append("remove_file", "true");
      }
      const response = await axiosInstance.patch(
        `${thread}${thread_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getReactionCounts = (thread) => {
  if (!thread.reactions)
    return { like: 0, insightful: 0, celebrate: 0, total: 0 };
  const counts = {
    like: thread.reactions.like || 0,
    insightful: thread.reactions.insightful || 0,
    celebrate: thread.reactions.celebrate || 0,
    total: 0,
  };
  counts.total = counts.like + counts.insightful + counts.celebrate;
  return counts;
};

export const formatThreadForDisplay = (thread) => ({
  ...thread,
  comment_count: thread.thought_count || 0,
  reaction_counts: thread.reactions || { like: 0, insightful: 0, celebrate: 0 },
  has_media: !!(thread.media_url || thread.file_url),
  media_url: thread.media_url || thread.file_url,
  media_name: thread.media_name || thread.file_name,
  created_at: thread.created_at,
  last_comment_at: thread.last_thought_at || thread.created_at,
});

export const formatThoughtForDisplay = (thought) => ({
  ...thought,
  has_media: !!(thought.media_url || thought.file_url),
  media_url: thought.media_url || thought.file_url,
  media_name: thought.media_name || thought.file_name,
  created_at: thought.created_at,
});

export const fetchLeaseOutApi = createAsyncThunk(
  "fetchLeaseOutApi",
  async (limit = undefined, { rejectWithValue }) => {
    try {
      const params = limit ? { limit } : {};
      const response = await axiosInstance.get("/forum/lease-out", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createLeaseOutApi = createAsyncThunk(
  "createLeaseOutApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/forum/lease-out", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateLeaseOutApi = createAsyncThunk(
  "updateLeaseOutApi",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/forum/lease-out/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteLeaseOutApi = createAsyncThunk(
  "deleteLeaseOutApi",
  async ({ id, hardDelete = false }, { rejectWithValue }) => {
    try {
      const url = hardDelete
        ? `/forum/lease-out/${id}?hard_delete=true`
        : `/forum/lease-out/${id}`;
      await axiosInstance.delete(url);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchSalesFinancingApi = createAsyncThunk(
  "fetchSalesFinancingApi",
  async (limit = undefined, { rejectWithValue }) => {
    try {
      const params = limit ? { limit } : {};
      const response = await axiosInstance.get("/forum/nyc-sales-financing", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createSalesFinancingApi = createAsyncThunk(
  "createSalesFinancingApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/forum/nyc-sales-financing",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateSalesFinancingApi = createAsyncThunk(
  "updateSalesFinancingApi",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/forum/nyc-sales-financing/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const deleteSalesFinancingApi = createAsyncThunk(
  "deleteSalesFinancingApi",
  async ({ id, hardDelete = false }, { rejectWithValue }) => {
    try {
      const url = hardDelete
        ? `/forum/nyc-sales-financing/${id}?hard_delete=true`
        : `/forum/nyc-sales-financing/${id}`;
      await axiosInstance.delete(url);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchNycFeedApi = createAsyncThunk(
  "fetchNycFeedApi",
  async ({ leaseLimit, salesLimit } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (leaseLimit) params.lease_out_limit = leaseLimit;
      if (salesLimit) params.sales_financing_limit = salesLimit;
      const response = await axiosInstance.get("/forum/feed", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
