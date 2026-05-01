import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { DistilledCompTrackerList } from "./distilledCompTrackerList";
import { DistilledCompTracker } from "./distilledCompTracker";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export const DistilledCompTrackerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chart");

  const headerTitle =
    activeTab === "chart"
      ? "Distilled Comp Tracker Benchmark"
      : "Distilled Comp Tracker List";

  return (
    <Container fluid className="p-0">
      <div className="px-3 py-3 ">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h4 className="fw-bold mx-5 mx-md-0">{headerTitle}</h4>

          <div className="d-flex flex-wrap gap-2 px-3">
            <Button
              variant={activeTab === "chart" ? "light" : "dark"}
              onClick={() => setActiveTab("chart")}
              className="flex-grow-1 flex-md-grow-0"
            >
              DCT
            </Button>

            <Button
              variant={activeTab === "list" ? "light" : "dark"}
              onClick={() => setActiveTab("list")}
              className="flex-grow-1 flex-md-grow-0"
            >
              List
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/distilled-comp-tracker-form")}
              className="comp-button flex-grow-1 flex-md-grow-0 d-flex align-items-center justify-content-center gap-2 fw-semibold px-4"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Comp
            </Button>
          </div>
        </div>
      </div>

      <div className="justify-content-center">
        <Col md={12}>
          <Card className="no-shadow-hover border-0">
            {activeTab === "chart" && <DistilledCompTracker />}
            {activeTab === "list" && <DistilledCompTrackerList />}
          </Card>
        </Col>
      </div>
    </Container>
  );
};
