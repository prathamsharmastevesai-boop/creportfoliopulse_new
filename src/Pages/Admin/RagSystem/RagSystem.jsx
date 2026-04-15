import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getsystemtracingApi } from "../../../Networking/Admin/APIs/dashboardApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const RagSystem = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(getsystemtracingApi())
      .unwrap()
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching data:", err));
  }, [dispatch]);

  const avgResponseTime = data?.avg_response_time_ms || 0;
  const avgConfidence = data?.avg_confidence || 0;
  const positiveFeedback = data?.positive_feedback_percent || 0;
  const totalQueries = data?.total_queries || 0;

  const chartData = {
    labels: [
      "Avg Response Time (ms)",
      "Avg Confidence (%)",
      "Positive Feedback (%)",
      "Total Queries",
    ],
    datasets: [
      {
        label: "Metrics",
        data: [avgResponseTime, avgConfidence, positiveFeedback, totalQueries],
        backgroundColor: ["#0d6efd", "#198754", "#0dcaf0", "#6f42c1"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "RAG System Metrics Overview",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container-fuild p-3">
      <PageHeader
        title="RAG System Tracing"
        subtitle="Monitor query performance, confidence scores, and user feedback"
      />

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <Card variant="elevated" className="h-100 shadow-sm" bodyClass="text-center">
            <i className="bi bi-clock text-primary fs-4 mb-2"></i>
            <h6 className="fw-bold">Avg Response Time</h6>
            <p className="mb-0 fw-semibold">{avgResponseTime} ms</p>
          </Card>
        </div>
        <div className="col-md-3 mb-3">
          <Card variant="elevated" className="h-100 shadow-sm" bodyClass="text-center">
            <i className="bi bi-bullseye text-success fs-4 mb-2"></i>
            <h6 className="fw-bold">Avg Confidence</h6>
            <p className="mb-0 fw-semibold">{avgConfidence} %</p>
          </Card>
        </div>
        <div className="col-md-3 mb-3">
          <Card variant="elevated" className="h-100 shadow-sm" bodyClass="text-center">
            <i className="bi bi-graph-up text-info fs-4 mb-2"></i>
            <h6 className="fw-bold">Positive Feedback</h6>
            <p className="mb-0 fw-semibold">{positiveFeedback} %</p>
          </Card>
        </div>
        <div className="col-md-3 mb-3">
          <Card variant="elevated" className="h-100 shadow-sm" bodyClass="text-center">
            <i className="bi bi-activity text-primary fs-4 mb-2"></i>
            <h6 className="fw-bold">Total Queries</h6>
            <p className="mb-0 fw-semibold">{totalQueries}</p>
          </Card>
        </div>
      </div>

      <Card
        variant="elevated"
        className="mb-5 shadow-sm"
        title={
          <span className="fw-bold">
            <i className="bi bi-file-text me-2"></i> Recent Query Traces
          </span>
        }
      >
        {data ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="text-center text-muted py-4">
            <i className="bi bi-activity fs-3 mb-2 d-block"></i>
            <p className="mb-0">
              No query traces available <br />
              <small>
                Traces will appear here once users start making queries
              </small>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
