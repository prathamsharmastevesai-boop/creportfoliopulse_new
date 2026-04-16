import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Card from "../../../Component/Card/Card";

export const UserLeaseList = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const initialBuildings = location.state?.office;

  const handleLease = (initialBuildings, type) => {
    navigate("/user-lease-loi-chat", {
      state: { Building_id: initialBuildings, type },
    });
  };

  return (
    <div className="container-fluid px-4 pt-3">
      <div className="custom-page-header text-center text-md-start">
        <div className="custom-page-header-main d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-2 btn btn-dark btn-sm"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft size={16} />
            <span>Back</span>
          </div>
        </div>
        <h5 className="custom-page-header-content">
          Select Section to Chat with Lease Agreement or Letter of Intent
        </h5>
      </div>

      <Container className="pb-5">
        <Row className="justify-content-center g-4">
          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              className="shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-center align-items-center text-center"
              variant="elevated"
              title="Lease Agreement"
              noPadding
            >
              <p className="fs-6 mb-4 text-muted">
                Upload documents related to <strong>Lease Agreement</strong>{" "}
                here.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() =>
                  handleLease(initialBuildings?.buildingId, "Lease")
                }
              >
                Chat with Lease Agreement
              </Button>
            </Card>
          </Col>

          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              className="shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-center align-items-center text-center"
              variant="elevated"
              title="Letter of Intent"
              noPadding
            >
              <p className="fs-6 mb-4 text-muted">
                Upload documents related to <strong>Letter of Intent</strong>{" "}
                here.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() => handleLease(initialBuildings?.buildingId, "LOI")}
              >
                Chat with Letter of Intent
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
