import React from "react";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { FEATURE_CONFIG, getFeatureLabel } from "./featureConfig";
import { Building2, Eye, Lock, CheckCircle, XCircle } from "lucide-react";

const FeatureAccessModal = ({
  selectedUser,
  features,
  togglingFeature,
  onClose,
  onToggleFeature,
  onOpenBuildingModal,
}) => {
  const total = Object.keys(features).length;
  const enabled = Object.values(features).filter(Boolean).length;

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 px-4 pt-4">
            <h5 className="fw-bold">Feature Access – {selectedUser.email}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body px-4">
            <div className="rounded-4 p-3 mb-4 d-flex gap-4">
              <div>
                <small className="text-muted d-block">Total Features</small>
                <span className="fw-bold">{total}</span>
              </div>
              <div className="border-start ps-4">
                <small className="text-success d-block">Enabled</small>
                <span className="fw-bold text-success">{enabled}</span>
              </div>
              <div className="border-start ps-4">
                <small className="text-danger d-block">Disabled</small>
                <span className="fw-bold text-danger">{total - enabled}</span>
              </div>
            </div>

            {Object.entries(FEATURE_CONFIG).map(([sectionKey, section]) => (
              <div key={sectionKey} className="mb-4">
                <h6 className="fw-bold mb-3">{section.title}</h6>
                <Row className="g-3">
                  {Object.entries(section.features).map(([key, feature]) => {
                    const meta = typeof feature === "object" ? feature : null;
                    const label = getFeatureLabel(feature);

                    return (
                      <Col xs={12} sm={6} lg={4} key={key}>
                        <div className="permission-card d-flex justify-content-between align-items-center rounded-3 p-3 border">
                          <div>
                            <span className="small fw-medium">{label}</span>

                            {meta?.buildingCategory && (
                              <div
                                className={
                                  features[key] ? "text-primary" : "text-muted"
                                }
                                style={{
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  userSelect: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                                onClick={() => {
                                  if (!features[key]) {
                                    toast.warning(
                                      `Enable "${label}" first to manage building access.`,
                                    );
                                    return;
                                  }

                                  onOpenBuildingModal(
                                    meta.buildingCategory,
                                    label,
                                  );
                                }}
                              >
                                <Building2 size={14} />

                                {features[key] ? (
                                  <>
                                    <Eye size={14} />
                                    View building access
                                  </>
                                ) : (
                                  <>
                                    <Lock size={14} />
                                    Enable to manage buildings
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {features[key] ? (
                              <CheckCircle size={16} className="text-success" />
                            ) : (
                              <XCircle size={16} className="text-danger" />
                            )}

                            {togglingFeature === key && <Spinner size="sm" />}

                            <Form.Check
                              type="switch"
                              checked={features[key]}
                              disabled={togglingFeature === key}
                              onChange={(e) =>
                                onToggleFeature(key, e.target.checked)
                              }
                            />
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))}
          </div>

          <div className="modal-footer border-0 px-4 pb-4">
            <Button variant="outline-secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureAccessModal;
