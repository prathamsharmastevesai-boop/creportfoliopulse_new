import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Card from "../../../Component/Card/Card";

export const SelectUserBuildingCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buildingId = location?.state?.office?.buildingId;

  const handleCategory = (category) => {
    navigate("/BuildingChat", {
      state: {
        buildingId,
        category,
      },
    });
  };

  return (
    <>
      <div
        className="text-center py-3 mb-4 shadow-sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h5 className="fw-bold text-dark px-3">Select Category</h5>
      </div>

      <div className="px-3 mb-4 d-flex justify-content-center justify-content-md-start">
        <div
          className="bg-dark text-white py-2 d-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate(-1)}
          style={{
            cursor: "pointer",
            width: "110px",
            borderRadius: 10,
          }}
        >
          <FaArrowLeft size={16} />
          <span>Back</span>
        </div>
      </div>

      <Container className="pb-5">
        <Row className="justify-content-center g-4">
          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              className="shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-center align-items-center text-center"
              variant="elevated"
              title="Floor Plan"
              noPadding
            >
              <p className="fs-6 mb-4">
                documents related to <strong>Floor Plan</strong>.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() => handleCategory("floor_plan")}
              >
                Floor Plan
              </Button>
            </Card>
          </Col>

          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              className="shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-center align-items-center text-center"
              variant="elevated"
              title="Building Stack"
              noPadding
            >
              <p className="fs-6 mb-4">
                documents related to <strong>Building Stack</strong>.
              </p>
              <Button
                variant="dark"
                size="lg"
                className="w-100"
                onClick={() => handleCategory("building_stack")}
              >
                Building Stack
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
