import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";

export const fetchAdminPendingDealsApi = createAsyncThunk(
  "adminLoi/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/loi/admin/deals/pending");
      return res.data?.data ?? res.data ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const extractLoiDataApi = createAsyncThunk(
  "adminLoi/extractData",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/loi/admin/deals/${dealId}/extract`,
        {},
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateAllLoiFieldsApi = createAsyncThunk(
  "adminLoi/updateAllLoiFields",
  async ({ dealId, updates }, thunkAPI) => {
    try {
      const numericFields = [
        "rsf",
        "lease_term_years",
        "free_rent_months",
        "escalation_pct",
        "ti_allowance_psf",
        "tax_base_year",
        "net_effective_rent",
        "security_deposit",
      ];

      const cleanedUpdates = {};

      Object.entries(updates).forEach(([fieldName, value]) => {
        if (value === "" || value === null || value === undefined) return;

        cleanedUpdates[fieldName] =
          numericFields.includes(fieldName) && value !== "" && value !== null
            ? Number(value)
            : value;
      });

      const response = await axiosInstance.patch(
        `/loi/admin/deals/${dealId}/extracted-field`,
        {
          updates: cleanedUpdates,
        },
      );

      return {
        ...response.data,
        updates: cleanedUpdates,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchDeltaReportApi = createAsyncThunk(
  "adminLoi/fetchDelta",
  async (
    { dealId, buildingProfileId, buildingName = "" },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.post(`/loi/admin/deals/${dealId}/delta`, {
        building_profile_id: buildingProfileId,
        building_name: buildingName,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateLoiFieldApi = createAsyncThunk(
  "adminLoi/updateField",
  async (
    { dealId, fieldName, newValue, isAdminSourced = true },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/loi/admin/deals/${dealId}/extracted-field`,
        {
          field_name: fieldName,
          new_value: newValue,
          is_admin_sourced: isAdminSourced,
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const draftCounterLoiApi = createAsyncThunk(
  "adminLoi/draftCounter",
  async ({ dealId, strategy_text, template_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/loi/admin/deals/${dealId}/draft-counter`,
        {
          strategy_text,
          template_id,
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCitationsApi = createAsyncThunk(
  "adminLoi/fetchCitations",
  async ({ dealId, versionId }, { rejectWithValue }) => {
    console.log(dealId, versionId, "dealId, versionId ");

    try {
      const res = await axiosInstance.get(
        `/loi/admin/deals/${dealId}/citations/${versionId}`,
      );
      return (res.data?.citations || res.data) ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const certifyVersionApi = createAsyncThunk(
  "adminLoi/certifyVersion",
  async ({ dealId, version_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/loi/admin/deals/${dealId}/certify`,
        { version_id },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchLoiDocumentApi = createAsyncThunk(
  "adminLoi/fetchDocument",
  async ({ dealId, version = "v2" }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/loi/admin/deals/${dealId}/document/${version}`,
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchDealPdfApi = createAsyncThunk(
  "adminLoiAudit/fetchDealPdf",
  async (dealId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/loi/admin/deals/${dealId}/pdf`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "PDF not available.",
      );
    }
  },
);

export const downloadCertifiedDocApi = createAsyncThunk(
  "adminLoi/downloadCertified",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/loi/admin/deals/${dealId}/download`,
        {
          responseType: "blob",
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAuditStatsApi = createAsyncThunk(
  "adminLoi/fetchAuditStats",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/loi/admin/deals/${dealId}/audit`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchVersionTimelineApi = createAsyncThunk(
  "adminLoi/fetchTimeline",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/loi/admin/deals/${dealId}/timeline`,
      );
      return (res.data?.timeline || res.data) ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchDealContrastApi = createAsyncThunk(
  "adminLoi/fetchContrast",
  async ({ current_deal_id, query }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/loi/admin/rag/contrast", {
        current_deal_id,
        query,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const askRAGApi = createAsyncThunk(
  "adminLoi/askRAG",
  async ({ question }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/loi/admin/rag/ask", { question });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAdminDashboardDealsApi = createAsyncThunk(
  "adminLoi/fetchDashboard",
  async (filters, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/loi/admin/deals", {
        params: filters,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchLoiTemplatesApi = createAsyncThunk(
  "adminLoi/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/loi/admin/templates");
      return res.data?.data ?? res.data ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const uploadLoiTemplateApi = createAsyncThunk(
  "adminLoi/uploadTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/loi/admin/templates/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBuildingProfilesApi = createAsyncThunk(
  "adminLoi/fetchProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/loi/admin/building-profiles");
      return res.data?.data ?? res.data ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createBuildingProfileApi = createAsyncThunk(
  "adminLoi/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/loi/admin/building-profiles",
        profileData,
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBuildingProfileApi = createAsyncThunk(
  "adminLoi/updateProfile",
  async ({ profileId, profileData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/loi/admin/building-profiles/${profileId}`,
        profileData,
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
