import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSpace,
  getSpacesByBuilding,
  getSpaceUpAssginBuildings,
} from "../../../Networking/User/APIs/spaceUp/spaceUpApi";
import { toast } from "react-toastify";

export const AddSpaceModal = ({ show, onClose, buildingId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.spaceUpSlice);

  const [suite, setSuite] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setSuite("");
      setFloor("");
      setDescription("");
      setErrors({});
    }
  }, [show]);

  if (!show) return null;

  const validate = () => {
    const newErrors = {};

    if (!suite.trim()) {
      newErrors.suite = "Suite / Unit is required.";
    }

    if (floor && !/^[0-9]+$/.test(floor.trim())) {
      newErrors.floor = "Floor must be a number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!buildingId) {
      toast.error("Building not selected");
      return;
    }

    if (!validate()) return;

    const payload = {
      suite_number: suite.trim(),
      floor: floor.trim() || null,
      description: description.trim() || null,
    };

    const result = await dispatch(createSpace({ buildingId, payload }));
    await dispatch(getSpacesByBuilding(buildingId));

    if (createSpace.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Vacant Space</h5>
            <button
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Suite / Unit *</label>
              <input
                className={`form-control ${errors.suite ? "is-invalid" : ""}`}
                value={suite}
                onChange={(e) => {
                  setSuite(e.target.value);
                  if (errors.suite)
                    setErrors((prev) => ({ ...prev, suite: "" }));
                }}
                disabled={loading}
              />
              {errors.suite && (
                <div className="invalid-feedback d-block">{errors.suite}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Floor</label>
              <input
                className={`form-control ${errors.floor ? "is-invalid" : ""}`}
                value={floor}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^[0-9]*$/.test(value)) {
                    setFloor(value);
                    if (errors.floor)
                      setErrors((prev) => ({ ...prev, floor: "" }));
                  }
                }}
                disabled={loading}
              />
              {errors.floor && (
                <div className="invalid-feedback d-block">{errors.floor}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Space"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
