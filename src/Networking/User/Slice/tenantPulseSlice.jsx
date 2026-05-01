import { createSlice } from "@reduxjs/toolkit";
import {
  getFollowingCompanies,
  followCompany,
  unfollowCompany,
  getTenantFeed,
} from "../APIs/TenantPulse/tenantPulseApi";

const initialState = {
  following: {
    companies: [],
    followed_count: 0,
    max_allowed: 10,
    loading: false,
    error: null,
  },
  feed: {
    data: [],
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0,
    loading: false,
    error: null,
  },
};

const tenantPulseSlice = createSlice({
  name: "tenantPulse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Following Companies
    builder.addCase(getFollowingCompanies.pending, (state) => {
      state.following.loading = true;
    });
    builder.addCase(getFollowingCompanies.fulfilled, (state, action) => {
      state.following.loading = false;
      state.following.companies = action.payload.companies;
      state.following.followed_count = action.payload.followed_count;
      state.following.max_allowed = action.payload.max_allowed;
    });
    builder.addCase(getFollowingCompanies.rejected, (state, action) => {
      state.following.loading = false;
      state.following.error = action.payload;
    });

    // Follow Company
    builder.addCase(followCompany.pending, (state) => {
      state.following.loading = true;
    });
    builder.addCase(followCompany.fulfilled, (state, action) => {
      state.following.loading = false;
      state.following.followed_count = action.payload.followed_count;
      state.following.max_allowed = action.payload.max_allowed;
      // Optionally re-fetch companies or push to state
    });
    builder.addCase(followCompany.rejected, (state, action) => {
      state.following.loading = false;
      state.following.error = action.payload;
    });

    // Unfollow Company
    builder.addCase(unfollowCompany.pending, (state) => {
      state.following.loading = true;
    });
    builder.addCase(unfollowCompany.fulfilled, (state, action) => {
      state.following.loading = false;
      state.following.companies = state.following.companies.filter(
        (c) => c.company_name !== action.payload.company_name
      );
      state.following.followed_count -= 1;
    });
    builder.addCase(unfollowCompany.rejected, (state, action) => {
      state.following.loading = false;
      state.following.error = action.payload;
    });

    // Tenant Feed
    builder.addCase(getTenantFeed.pending, (state) => {
      state.feed.loading = true;
    });
    builder.addCase(getTenantFeed.fulfilled, (state, action) => {
      state.feed.loading = false;
      if (action.payload.page === 1) {
        state.feed.data = action.payload.data;
      } else {
        state.feed.data = [...state.feed.data, ...action.payload.data];
      }
      state.feed.page = action.payload.page;
      state.feed.page_size = action.payload.page_size;
      state.feed.total = action.payload.total;
      state.feed.total_pages = action.payload.total_pages;
    });
    builder.addCase(getTenantFeed.rejected, (state, action) => {
      state.feed.loading = false;
      state.feed.error = action.payload;
    });
  },
});

export default tenantPulseSlice.reducer;
