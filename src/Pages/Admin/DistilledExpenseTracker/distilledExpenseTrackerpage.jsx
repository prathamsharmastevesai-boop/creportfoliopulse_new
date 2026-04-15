import React, { useState } from "react";
import { useTheme } from "../../../Context/ThemeContext";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { DistilledExpenseTracker } from "./distilledExpenseTracker";
import { DistilledExpenseTrackerlist } from "./distilledExpenseTrackerlist";
import PageHeader from "../../../Component/PageHeader/PageHeader";

export const DistilledExpenseTrackerPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("form");

  const getBtnVariant = (tab) => {
    const isActive = activeTab === tab;
    if (theme === "light") {
      return isActive ? "dark" : "light";
    } else if (theme === "blue") {
      return isActive ? "primary" : "outline-light";
    } else {

      return isActive ? "light" : "outline-light";
    }
  };

  const headerTitle =
    activeTab === "form" ? "Add Submission" : "Submissions List";

  return (
    <>
      <PageHeader
        className="p-2"
        title="Distilled Expense Tracker"
        subtitle={
          activeTab === "form"
            ? "Submit new expense data for processing and analysis"
            : "Monitor and manage historical expense submissions and reports"
        }
        actions={
          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant={getBtnVariant("form")}
              size="sm"
              onClick={() => setActiveTab("form")}
            >
              Add Submission
            </Button>
            <Button
              variant={getBtnVariant("list")}
              size="sm"
              onClick={() => setActiveTab("list")}
            >
              View Submissions
            </Button>
          </div>
        }
      />

      <Col md={12}>
        <Card className="shadow-sm border-0">
          {activeTab === "form" && <DistilledExpenseTracker />}
          {activeTab === "list" && <DistilledExpenseTrackerlist />}
        </Card>
      </Col>
    </>
  );
};
