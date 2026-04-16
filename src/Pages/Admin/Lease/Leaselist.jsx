import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Card from "../../../Component/Card/Card";
import PageHeader from "../../../Component/PageHeader/PageHeader";

export const LeaseList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialBuildings = location?.state?.office;
  const id = initialBuildings?.buildingId;

  const handleLease = (Building_id) => {
    navigate("/admin-lease-loi-upload", {
      state: {
        office: { Building_id, type: "Lease" },
      },
    });
  };

  const handleLOI = (Building_id) => {
    navigate("/admin-lease-loi-upload", {
      state: {
        office: { Building_id, type: "LOI" },
      },
    });
  };

  return (
    <div className="container-fluid px-4 pt-3">
      <div class="custom-page-header text-center text-md-start">
        <div class="custom-page-header-main d-flex align-items-center gap-3">
          <div class="custom-page-header-main d-flex align-items-center gap-3">
            <Button
              variant="dark"
              size="sm"
              className="d-flex align-items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> Back
            </Button>
          </div>
        </div>
        <h5 class="custom-page-header-content">
          Select whether to upload a Lease Agreement or a Letter of Intent (LOI)
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
              <p className="fs-6 mb-4">
                Upload documents related to <strong>Lease Agreement</strong>{" "}
                here.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() => handleLease(id)}
              >
                Upload Lease Agreement
              </Button>
            </Card>
          </Col>

          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              variant="elevated"
              className="shadow-lg border-0 h-100"
              title="Letter of Intent"
              bodyClass="d-flex flex-column justify-content-center align-items-center text-center p-4"
            >
              <p className="fs-6 mb-4">
                Upload documents related to <strong>Letter of Intent</strong>{" "}
                here.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() => handleLOI(id)}
              >
                Upload Letter of Intent
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
