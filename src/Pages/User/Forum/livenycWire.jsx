import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaseOutApi,
  createLeaseOutApi,
  updateLeaseOutApi,
  deleteLeaseOutApi,
  fetchSalesFinancingApi,
  createSalesFinancingApi,
  updateSalesFinancingApi,
  deleteSalesFinancingApi,
} from "../../../Networking/Admin/APIs/forumApi";
import { LeaseOutPanel } from "./leaseOutPanel";
import ConfirmDeleteModal from "../../../Component/confirmDeleteModal";
import { FormModal } from "./formModel";
import { SalesFinancingPanel } from "./salesFinancingPanel";

const Spinner = ({ small }) => (
  <div className={`nyc-spinner${small ? " nyc-spinner--sm" : ""}`} />
);

export const LiveNYCWire = ({ isAdmin = false }) => (
  <div className="nyc-wire">
    <LeaseOutPanel isAdmin={isAdmin} />
    <SalesFinancingPanel isAdmin={isAdmin} />
  </div>
);

export default LiveNYCWire;
