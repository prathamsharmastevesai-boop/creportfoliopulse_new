import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getBuildingPermissionsApi,
  updateBuildingPermissionApi,
} from "../../../Networking/Admin/APIs/UserManagement";

const BuildingPermissionsModal = ({
  userEmail,
  featureLabel,
  category,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [buildings, setBuildings] = useState([]);
  const [originalBuildings, setOriginalBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const res = await dispatch(
          getBuildingPermissionsApi({ email: userEmail, category }),
        ).unwrap();

        setBuildings(res || []);
        setOriginalBuildings(res || []);
      } catch (error) {
        console.error("Failed to fetch building permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [dispatch, userEmail, category]);

  const handleToggle = (buildingId) => {
    setBuildings((prev) =>
      prev.map((b) =>
        b.building_id === buildingId ? { ...b, has_access: !b.has_access } : b,
      ),
    );
  };

  const changedPermissions = useMemo(() => {
    return buildings
      .filter((building) => {
        const original = originalBuildings.find(
          (b) => b.building_id === building.building_id,
        );
        return original && original.has_access !== building.has_access;
      })
      .map((building) => ({
        building_id: Number(building.building_id),
        has_access: Boolean(building.has_access),
      }));
  }, [buildings, originalBuildings]);

  const handleSubmit = async () => {
    if (changedPermissions.length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateBuildingPermissionApi({
          email: userEmail,
          category,
          permissions: changedPermissions,
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update permissions:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredBuildings = buildings.filter(
    (b) =>
      b.address?.toLowerCase().includes(search.toLowerCase()) ||
      String(b.building_id).includes(search),
  );

  const grantedCount = buildings.filter((b) => b.has_access).length;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div>
              <h5 className="fw-bold mb-1">Building Permissions</h5>
              <p className="text-muted small mb-0">
                <span className="badge bg-primary bg-opacity-10 text-primary me-2">
                  {featureLabel}
                </span>
                {userEmail}
              </p>
            </div>
            <button className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          <div className="px-4 py-2 border-bottom d-flex flex-wrap gap-4 align-items-center">
            <small>
              Total: <strong>{buildings.length}</strong>
            </small>
            <small className="text-success">
              Granted: <strong>{grantedCount}</strong>
            </small>
            <small className="text-danger">
              Denied: <strong>{buildings.length - grantedCount}</strong>
            </small>
            <small className="text-primary">
              Changed: <strong>{changedPermissions.length}</strong>
            </small>

            <div className="ms-auto" style={{ minWidth: 220 }}>
              <Form.Control
                size="sm"
                placeholder="Search by address or ID..."
                className="rounded-pill"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-body px-4 py-3" style={{ maxHeight: "55vh" }}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="small text-muted mt-2">Loading buildings...</p>
              </div>
            ) : filteredBuildings.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No buildings found
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {filteredBuildings.map((building) => {
                  const original = originalBuildings.find(
                    (b) => b.building_id === building.building_id,
                  );
                  const isChanged =
                    original && original.has_access !== building.has_access;

                  return (
                    <div
                      key={building.building_id}
                      className={`d-flex justify-content-between align-items-center border rounded-3 p-3 ${
                        isChanged ? "border-primary" : ""
                      }`}
                    >
                      <div>
                        <div className="fw-medium small">
                          {building.address && building.address !== "undefined"
                            ? building.address
                            : "— Address not set —"}
                        </div>
                        <div className="text-muted small">
                          Building ID: {building.building_id}
                        </div>
                        {isChanged && (
                          <div className="text-primary small fw-semibold mt-1">
                            Changed
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <Form.Check
                          type="switch"
                          checked={building.has_access}
                          disabled={saving}
                          onChange={() => handleToggle(building.building_id)}
                          label={building.has_access ? "Allowed" : "Denied"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-footer border-0 px-4 pb-4">
            <Button
              variant="outline-secondary"
              className="rounded-pill px-4"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="outline-primary"
              className="rounded-pill px-4"
              onClick={handleSubmit}
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Done"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingPermissionsModal;
