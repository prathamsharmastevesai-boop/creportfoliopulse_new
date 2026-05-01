import { createSlice } from "@reduxjs/toolkit";
import {

  fetchAdminDashboardDealsApi,
  fetchDeltaReportApi,
  fetchCitationsApi,
  fetchVersionTimelineApi,
  fetchDealContrastApi,
  fetchLoiTemplatesApi,
  fetchBuildingProfilesApi,
  createBuildingProfileApi,
  updateBuildingProfileApi,
  fetchLoiDocumentApi,
  extractLoiDataApi,
  fetchAuditStatsApi,
  askRAGApi,
  updateLoiFieldApi,
  certifyVersionApi,
  draftCounterLoiApi,
  updateAllLoiFieldsApi,
  fetchDealPdfApi,
  uploadLoiTemplateApi,
} from "../APIs/AdminLoiAuditApi";

const adminLoiAuditSlice = createSlice({
  name: "adminLoiAudit",
  initialState: {
    pendingDeals: [],
    allDeals: [],
    templates: [],
    buildingProfiles: [],
    dashboardStats: {
      total: 0,
      submitted: 0,
      counterSent: 0,
      vectorized: 0,
    },
    currentDealDelta: null,
    currentDealCitations: [],
    currentDealTimeline: [],
    currentDealContrast: null,
    currentDealDocument: null,
    currentAuditStats: null,

    dealPdfUrl: null,
    dealPdfLoading: false,

    previewUrl: null,

    draftLoading: false,
    certifyLoading: false,

    versionId: null,

    templatesLoading: false,

    extractedLoiData: null,
    extractionLoading: false,
    updateFieldLoading: false,

    ragAnswer: null,
    loading: false,
    error: null,

    pendingDealsLoading: false,
    dashboardDealsLoading: false,
    deltaReportLoading: false,
    citationsLoading: false,
    timelineLoading: false,
    contrastLoading: false,
    documentLoading: false,
    profilesLoading: false,
    auditStatsLoading: false,
    ragLoading: false,
    uploadLoading: false,
  },

  reducers: {
    clearExtractedLoiData: (state) => {
      state.extractedLoiData = null;
    },
    clearCurrentDealDelta: (state) => {
      state.currentDealDelta = null;
    },
    clearRagAnswer: (state) => {
      state.ragAnswer = null;
    },
    clearVersionId: (state) => {
      state.versionId = null;
      state.currentDealDocument = null;
      state.currentDealCitations = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAuditStatsApi.pending, (state) => {
        state.auditStatsLoading = true;
      })
      .addCase(fetchAuditStatsApi.fulfilled, (state, action) => {
        state.currentAuditStats = action.payload;
        state.auditStatsLoading = false;
      })
      .addCase(fetchAuditStatsApi.rejected, (state) => {
        state.auditStatsLoading = false;
      })

      .addCase(askRAGApi.pending, (state) => {
        state.ragLoading = true;
      })
      .addCase(askRAGApi.fulfilled, (state, action) => {
        state.ragAnswer = action.payload;
        state.ragLoading = false;
      })
      .addCase(askRAGApi.rejected, (state) => {
        state.ragLoading = false;
      })

      .addCase(uploadLoiTemplateApi.pending, (state) => {
        state.uploadLoading = true;
      })
      .addCase(uploadLoiTemplateApi.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadLoiTemplateApi.rejected, (state) => {
        state.uploadLoading = false;
      })



      .addCase(fetchLoiDocumentApi.pending, (state) => {
        state.documentLoading = true;
      })
      .addCase(fetchLoiDocumentApi.fulfilled, (state, action) => {
        state.currentDealDocument = action.payload;
        state.documentLoading = false;
        state.previewUrl =
          action.payload?.url ?? action.payload?.preview_url ?? null;
      })
      .addCase(fetchLoiDocumentApi.rejected, (state) => {
        state.documentLoading = false;
      })

      .addCase(fetchLoiTemplatesApi.pending, (state) => {
        state.templatesLoading = true;
      })
      .addCase(fetchLoiTemplatesApi.fulfilled, (state, action) => {
        state.templates = action.payload.templates || [];
        state.activeTemplateId = action.payload.active_template_id || null;
        state.templatesLoading = false;
      })
      .addCase(fetchLoiTemplatesApi.rejected, (state) => {
        state.templatesLoading = false;
      })

      .addCase(fetchBuildingProfilesApi.pending, (state) => {
        state.profilesLoading = true;
      })
      .addCase(fetchBuildingProfilesApi.fulfilled, (state, action) => {
        state.buildingProfiles = action.payload.profiles || [];
        state.profilesLoading = false;
      })
      .addCase(fetchBuildingProfilesApi.rejected, (state) => {
        state.profilesLoading = false;
      })
      .addCase(createBuildingProfileApi.fulfilled, (state, action) => { })
      .addCase(updateBuildingProfileApi.fulfilled, (state, action) => { })

      .addCase(fetchAdminDashboardDealsApi.pending, (state) => {
        state.dashboardDealsLoading = true;
      })
      .addCase(fetchAdminDashboardDealsApi.fulfilled, (state, action) => {
        state.dashboardDealsLoading = false;
        const deals = action.payload.deals || [];
        state.allDeals = deals;

        if (action.payload.stats) {
          state.dashboardStats = action.payload.stats;
        } else {
          state.dashboardStats = {
            total: action.payload.total || deals.length,
            submitted: deals.filter((d) => d.status === "SUBMITTED").length,
            counterSent: deals.filter((d) => d.status === "COUNTER_SENT")
              .length,
            vectorized: deals.filter((d) => d.is_vectorized).length,
          };
        }
      })
      .addCase(fetchAdminDashboardDealsApi.rejected, (state) => {
        state.dashboardDealsLoading = false;
      })

      .addCase(updateAllLoiFieldsApi.pending, (state) => {
        state.updateFieldLoading = true;
      })
      .addCase(updateAllLoiFieldsApi.fulfilled, (state, action) => {
        state.updateFieldLoading = false;

        const updates = action.payload?.updates || {};

        Object.entries(updates).forEach(([fieldName, newValue]) => {
          if (state.extractedLoiData?.extracted?.[fieldName]) {
            state.extractedLoiData.extracted[fieldName].value = newValue;
          } else if (state.extractedLoiData?.extracted) {
            state.extractedLoiData.extracted[fieldName] = {
              value: newValue,
              is_na: false,
            };
          }
        });
      })
      .addCase(updateAllLoiFieldsApi.rejected, (state, action) => {
        state.updateFieldLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchDeltaReportApi.pending, (state) => {
        state.deltaReportLoading = true;
      })
      .addCase(fetchDeltaReportApi.fulfilled, (state, action) => {
        state.currentDealDelta = action.payload;
        state.deltaReportLoading = false;
      })
      .addCase(fetchDeltaReportApi.rejected, (state) => {
        state.deltaReportLoading = false;
      })

      .addCase(fetchCitationsApi.pending, (state) => {
        state.citationsLoading = true;
      })
      .addCase(fetchCitationsApi.fulfilled, (state, action) => {
        state.currentDealCitations = action.payload;
        state.citationsLoading = false;
      })
      .addCase(fetchCitationsApi.rejected, (state) => {
        state.citationsLoading = false;
      })

      .addCase(fetchVersionTimelineApi.pending, (state) => {
        state.timelineLoading = true;
      })
      .addCase(fetchVersionTimelineApi.fulfilled, (state, action) => {
        state.currentDealTimeline = action.payload;
        state.timelineLoading = false;
      })
      .addCase(fetchVersionTimelineApi.rejected, (state) => {
        state.timelineLoading = false;
      })

      .addCase(fetchDealContrastApi.pending, (state) => {
        state.contrastLoading = true;
      })
      .addCase(fetchDealContrastApi.fulfilled, (state, action) => {
        state.currentDealContrast = action.payload;
        state.contrastLoading = false;
      })
      .addCase(fetchDealContrastApi.rejected, (state) => {
        state.contrastLoading = false;
      })

      .addCase(extractLoiDataApi.pending, (state) => {
        state.extractionLoading = true;
      })
      .addCase(extractLoiDataApi.fulfilled, (state, action) => {
        state.extractionLoading = false;
        state.versionId = action.payload?.version_id || null;
        state.extractedLoiData = action.payload;
      })
      .addCase(extractLoiDataApi.rejected, (state, action) => {
        state.extractionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateLoiFieldApi.pending, (state) => {
        state.updateFieldLoading = true;
      })
      .addCase(updateLoiFieldApi.fulfilled, (state, action) => {
        state.updateFieldLoading = false;

        const { fieldName, newValue } = action.meta.arg || {};

        if (state.extractedLoiData?.extracted?.[fieldName]) {
          state.extractedLoiData.extracted[fieldName].value = newValue;
        }
      })
      .addCase(updateLoiFieldApi.rejected, (state, action) => {
        state.updateFieldLoading = false;
        state.error = action.payload;
      })

      .addCase(draftCounterLoiApi.pending, (state) => {
        state.draftLoading = true;
      })
      .addCase(draftCounterLoiApi.fulfilled, (state, action) => {
        state.draftLoading = false;
        state.currentDealDocument = action.payload;

        if (action.payload?.version_id) {
          state.versionId = action.payload.version_id;
        }
      })
      .addCase(draftCounterLoiApi.rejected, (state, action) => {
        state.draftLoading = false;
        state.error = action.payload;
      })

      .addCase(certifyVersionApi.pending, (state) => {
        state.certifyLoading = true;
      })
      .addCase(certifyVersionApi.fulfilled, (state, action) => {
        state.certifyLoading = false;
      })
      .addCase(certifyVersionApi.rejected, (state, action) => {
        state.certifyLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchDealPdfApi.pending, (state) => {
        state.dealPdfLoading = true;
        state.dealPdfUrl = null;
      })
      .addCase(fetchDealPdfApi.fulfilled, (state, action) => {
        state.dealPdfLoading = false;
        state.dealPdfUrl = action.payload?.url || null;
      })
      .addCase(fetchDealPdfApi.rejected, (state) => {
        state.dealPdfLoading = false;
        state.dealPdfUrl = null;
      });
  },
});

export const { clearExtractedLoiData, clearCurrentDealDelta, clearRagAnswer } =
  adminLoiAuditSlice.actions;

export default adminLoiAuditSlice.reducer;
