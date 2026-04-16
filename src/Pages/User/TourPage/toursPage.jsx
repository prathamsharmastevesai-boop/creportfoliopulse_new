import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { ToursDetails } from "./ToursDetails/toursDetails";
import { Tours } from "./Tours/tours";
import { ChatBotModal } from "../../../Component/chatbotModel";

export const ToursPage = () => {
  const [activeTab, setActiveTab] = useState("form");

  const headerTitle = activeTab === "form" ? "Add Tour" : "Tours List";

  return (
    <>
      <div className="header-bg d-flex justify-content-between px-3 align-items-center sticky-header">
        <h5 className="activity-log m-0 ms-4">{headerTitle}</h5>
        <div className="d-flex gap-2">
          <Button
            variant={activeTab === "form" ? "light" : "dark"}
            onClick={() => setActiveTab("form")}
          >
            Add Tour
          </Button>

          <Button
            variant={activeTab === "list" ? "light" : "dark"}
            onClick={() => setActiveTab("list")}
          >
            View Tours
          </Button>
          <ChatBotModal category={"tour"} />
        </div>
      </div>

      <div>
        {activeTab === "form" && <Tours />}
        {activeTab === "list" && <ToursDetails />}
      </div>
    </>
  );
};
