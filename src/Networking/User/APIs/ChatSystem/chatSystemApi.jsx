import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import {
  conversationCreateGroupEndpoint,
  conversationDeleteMesaage,
  conversationDownloadFileEndpoint,
  conversationEndPoint,
  conversationLeaveGroupEndpoint,
  conversationListFilesEndpoint,
  conversationMessageEndpoint,
  conversationSendMessageEndpoint,
  conversationuploadChatFileEndpoint,
  conversationUploadFileEndpoint,
} from "../../../NWconfig";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(conversationEndPoint);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ conversationId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${conversationMessageEndpoint}${conversationId}?page=${page}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchFileUrl = createAsyncThunk(
  "chat/fetchFileUrl",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${conversationListFilesEndpoint}${fileId}`,
      );
      return {
        fileId,
        url: res.data.url,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load file");
    }
  },
);

export const downloadFileApi = createAsyncThunk(
  "chat/downloadFile",
  async ({ fileId, fileName }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("access_token");

      const res = await axiosInstance.get(
        `${conversationDownloadFileEndpoint}${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const link = document.createElement("a");
      link.href = res.data.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { fileId, success: true };
    } catch (err) {
      return rejectWithValue({
        fileId,
        error: err.response?.data || err.message,
      });
    }
  },
);

export const sendMessageAPi = createAsyncThunk(
  "chat/sendMessageAPi",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        conversationSendMessageEndpoint,
        payload,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${conversationDeleteMesaage}/${messageId}`);
      return messageId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);


export const createGroupApi = createAsyncThunk(
  "chat/createGroup",
  async ({ name, member_ids }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(conversationCreateGroupEndpoint, {
        name,
        member_ids,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const uploadChatFileApi = createAsyncThunk(
  "chat/uploadFile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        conversationuploadChatFileEndpoint,
        formData,
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  },
);

export const leaveGroupApi = createAsyncThunk(
  "chat/leaveGroup",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `${conversationLeaveGroupEndpoint}${conversationId}/leave`,
      );

      return { conversationId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteConversationApi = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/messenger/conversations/${conversationId}`,
      );
      return conversationId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const getMessengerList = createAsyncThunk(
  "messenger/getList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/messenger/list");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch messenger list",
      );
    }
  },
);
