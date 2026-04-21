import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSources,
  fetchFirms,
  fetchQuarters,
  fetchQuarterOverview,
  fetchSubmarkets,
  fetchTransactions,
} from "../../Networking/CommonApi/thePulseApi";
import "./thePulse.css";
import KPICard from "./PulseComponents/KPICard";
import TabBar from "./PulseComponents/TabBar";
import SectionCard from "./PulseComponents/SectionCard";
import {
  LeasingTrendChart,
  AvailabilityTrendChart,
  IndustryChart,
} from "./PulseComponents/PulseCharts";
import {
  TransactionTable,
  SubmarketTable,
} from "./PulseComponents/PulseTables";
import SourceCard from "./PulseComponents/SourceCard";
import RAGLoader from "../../Component/Loader";
import { ContactsHub } from "../User/ContactsHub/contactsHub";

export const ThePulse = () => {
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");

  const {
    firms,
    quarters,
    overview,
    submarkets,
    transactions,
    sources,
    loading,
    error,
  } = useSelector((state) => state.marketSlice);

  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [mainTab, setMainTab] = useState("intelligence");

  useEffect(() => {
    dispatch(fetchFirms());
    dispatch(fetchQuarters());
  }, [dispatch]);

  useEffect(() => {
    if (quarters?.length && !selectedQuarter) {
      setSelectedQuarter(quarters[0].id);
    }
  }, [quarters]);

  useEffect(() => {
    if (!selectedQuarter) return;
    dispatch(fetchQuarterOverview(selectedQuarter));
    dispatch(fetchSubmarkets(selectedQuarter));
    dispatch(fetchTransactions(selectedQuarter));
    dispatch(fetchSources(selectedQuarter));
  }, [selectedQuarter, dispatch]);

  const firmList = overview?.firms ?? firms ?? [];
  const kpiMetrics = overview?.kpi_metrics ?? [];
  const leasingTrendData = overview?.leasing_trends ?? [];
  const availTrendData = overview?.availability_trends ?? [];
  const industryData = overview?.industry_breakdown ?? [];
  const vacancyData = submarkets?.vacancy_data ?? [];
  const txList = transactions?.transactions ?? [];
  const sourceList = sources?.sources ?? [];

  const quarterLabel =
    overview?.quarter?.label ??
    quarters?.find((q) => q.id === selectedQuarter)?.name ??
    "";

  return (
    <div
      className="tp-container position-relative"
      style={role === "superuser" ? { marginTop: "60px" } : {}}
    >
    
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
          style={{
            backdropFilter: "blur(2px)",
            background: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        >
          <RAGLoader />
        </div>
      )}

   
      <div className="tp-header">
        
        <div className="tp-header-left">
          <h2 className="tp-header-title">The Pulse</h2>
          <p className="tp-header-sub">
            Synthesized Manhattan Office Market Report
            {quarterLabel ? ` — ${quarterLabel}` : ""}
          </p>

        
          {role === "user" && (
            <div className="tp-main-tabs">
              <button
                className={`tp-main-tab ${mainTab === "intelligence" ? "active" : ""}`}
                onClick={() => setMainTab("intelligence")}
              >
                Market Intelligence
              </button>
              <button
                className={`tp-main-tab ${mainTab === "contacts" ? "active" : ""}`}
                onClick={() => setMainTab("contacts")}
              >
                Contact Hub
              </button>
            </div>
          )}
        </div>

 
        {mainTab === "intelligence" && (
          <select
            className="tp-quarter-select"
            value={selectedQuarter ?? ""}
            onChange={(e) => setSelectedQuarter(Number(e.target.value) || null)}
          >
            <option value="">Select Quarter</option>
            {quarters?.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name ?? q.label}
              </option>
            ))}
          </select>
        )}
      </div>


      {error && mainTab === "intelligence" && (
        <div className="tp-status-banner text-danger">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

 
      {mainTab === "intelligence" ? (
        <>
     
          {kpiMetrics.length > 0 && (
            <div className="tp-kpi-grid">
              {kpiMetrics.map((metric) => (
                <KPICard key={metric.label} {...metric} firmList={firmList} />
              ))}
            </div>
          )}


          <div className="tp-tab-bar-wrapper">
            <TabBar active={activeTab} onChange={setActiveTab} />
          </div>

         
          <div className="mt-2">
            {activeTab === "overview" && (
              <div className="tp-chart-grid">
                <SectionCard title="Leasing Activity Trend">
                  {leasingTrendData.length > 0 ? (
                    <LeasingTrendChart
                      data={leasingTrendData}
                      firms={firmList}
                    />
                  ) : (
                    <p className="tp-empty">No data available</p>
                  )}
                </SectionCard>

                <SectionCard title="Availability Rate">
                  {availTrendData.length > 0 ? (
                    <AvailabilityTrendChart
                      data={availTrendData}
                      firms={firmList}
                    />
                  ) : (
                    <p className="tp-empty">No data available</p>
                  )}
                </SectionCard>

                <SectionCard title="Leasing by Industry">
                  {industryData.length > 0 ? (
                    <IndustryChart data={industryData} />
                  ) : (
                    <p className="tp-empty">No data available</p>
                  )}
                </SectionCard>
              </div>
            )}

            {activeTab === "submarkets" && (
              <div className="tp-chart-grid">
                {vacancyData.length > 0 ? (
                  vacancyData.map((sm) => (
                    <SectionCard key={sm.submarket} title={sm.submarket}>
                      <SubmarketTable submarketData={sm} />
                    </SectionCard>
                  ))
                ) : (
                  <p className="tp-empty">No data available</p>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <SectionCard title="Top Transactions">
                {txList.length > 0 ? (
                  <TransactionTable transactions={txList} />
                ) : (
                  <p className="tp-empty">No data available</p>
                )}
              </SectionCard>
            )}

            {activeTab === "sources" && (
              <div className="tp-chart-grid">
                {sourceList.length > 0 ? (
                  sourceList.map((src) => (
                    <SourceCard key={src.id} source={src} />
                  ))
                ) : (
                  <p className="tp-empty">No data available</p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <ContactsHub />
      )}
    </div>
  );
};
