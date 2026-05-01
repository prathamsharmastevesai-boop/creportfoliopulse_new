import { createSlice } from "@reduxjs/toolkit";
import {
  calculateTI,
  loadTemplates,
  loadTemplateById,
  saveTemplate,
  deleteTemplate,
} from "../APIs/Calculator/calcApi";

const DEFAULT_ITEMS = [
  "Demolition",
  "New HVAC System",
  "Painting",
  "Lighting",
  "Plumbing",
  "Carpeting",
  "Glass Front Offices",
  "Pantry Remodel",
  "Bathroom Remodel",
  "Tile (Stone/Ceramic)",
  "Hardwood Polishing",
];

const initialState = {
  sf: 5000,
  selectedItems: DEFAULT_ITEMS,
  prices: {},
  defaultPrices: {},
  breakdown: {},
  totals: null,
  templates: [],
  activeTemplate: null,
  loading: false,
  error: null,
};

const tiCalculatorSlice = createSlice({
  name: "tiCalculatorSlice",
  initialState,
  reducers: {
    setSf: (state, action) => {
      state.sf = action.payload;
    },
    setPriceForItem: (state, action) => {
      const { item, value } = action.payload;
      const numeric = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
      state.prices[item] = numeric;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    // calculateTI
    builder
      .addCase(calculateTI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateTI.fulfilled, (state, action) => {
        state.loading = false;
        state.breakdown = action.payload.breakdown;
        state.totals = action.payload;
        // extract default prices
        Object.keys(action.payload.breakdown).forEach((key) => {
          state.defaultPrices[key] =
            action.payload.breakdown[key].default_price;
        });
      })
      .addCase(calculateTI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // loadTemplates
    builder.addCase(loadTemplates.fulfilled, (state, action) => {
      state.templates = action.payload || [];
    });

    // loadTemplateById
    builder.addCase(loadTemplateById.fulfilled, (state, action) => {
      state.activeTemplate = action.payload.id;
      state.prices = action.payload.custom_prices || {};
      state.sf = action.payload.sf || 5000;
    });

    // deleteTemplate
    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.templates = state.templates.filter((t) => t.id !== deletedId);
      if (state.activeTemplate === deletedId) {
        state.activeTemplate = null;
      }
    });

    // saveTemplate
    builder.addCase(saveTemplate.fulfilled, (state, action) => {
      if (action.payload) {
        state.templates.push(action.payload);
      }
    });
  },
});

export const { setSf, setPriceForItem, setSelectedItems } =
  tiCalculatorSlice.actions;
export default tiCalculatorSlice.reducer;
