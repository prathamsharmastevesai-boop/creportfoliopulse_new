import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login, Sigup, UserDelete } from "../../NWconfig";
import axiosInstance from "./AxiosInstance";

export const LoginSubmit = createAsyncThunk(
  "auth/LoginSubmit",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(login, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      const res = response.data;

      return res;
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        toast.error("Invalid email or password.");
        return rejectWithValue("Invalid email or password.");
      }

      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed. Please try again.";
      return rejectWithValue(errMsg);
    }
  },
);

export const SignUpSubmit = createAsyncThunk(
  "auth/SignUpSubmit",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(Sigup, credentials);

      const { role, message } = response.data;

      if (message) {
        toast.success(message);
        return { message };
      }

      if (role) {
        return { role };
      }

      return rejectWithValue("Invalid response from server");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Signup failed";
      return rejectWithValue(message);
    }
  },
);

export const DeleteUser = createAsyncThunk(
  "auth/DeleteUser",
  async ({ email, company_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(UserDelete, {
        params: {
          email,
          company_id,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  },
);

export const useradmindeleteapi = createAsyncThunk(
  "auth/useradmindeleteapi",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(UserDelete, {
        params: {
          email,
          role,
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Delete failed";
      return rejectWithValue(message);
    }
  },
);

export const googleLoginService = createAsyncThunk(
  "auth/googleLoginService",
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/auth/google", {
        token: idToken,
      });

      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        "Google login failed. Please try again.";

      return rejectWithValue(errMsg);
    }
  },
);

export const fetchAUPStatus = createAsyncThunk(
  "aup/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/aup/status");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch AUP status",
      );
    }
  },
);

export const agreeAUP = createAsyncThunk(
  "aup/agree",
  async ({ aup_version }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/aup/agree", {
        aup_version,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to agree to AUP");
    }
  },
);

export const fetchPortfolios = createAsyncThunk(
  "auth/fetchPortfolios",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/portfolios");
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch portfolios";
      return rejectWithValue(errMsg);
    }
  },
);

export const selectPortfolio = createAsyncThunk(
  "auth/selectPortfolio",
  async ({ company_id, role }, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/select-portfolio", {
        company_id,
        role,
      });

      if (response.data) {
        const { role, aup_required, aup_version } = response.data;
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("company_id", String(company_id));

        return response.data;
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to select company";
      return rejectWithValue(errMsg);
    }
  },
);

export const getPortfolios = createAsyncThunk(
  "auth/getPortfolios",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/portfolios");

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to fetch companies";

      return rejectWithValue(errMsg);
    }
  },
);
