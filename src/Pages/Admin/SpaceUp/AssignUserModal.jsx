import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { assignBuilding } from "../../../Networking/Admin/APIs/spaceUpApi";
import { toast } from "react-toastify";
import { getAdminlistApi } from "../../../Networking/SuperAdmin/AdminSuperApi";

export const AssignUserModal = ({ show, onClose, buildingId }) => {
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("member");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getAdminlistApi()).unwrap();
      setUsers(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchUsers();
  }, [show]);

  if (!show) return null;

  const handleAssign = async () => {
    if (!selectedUser) return toast.error("Select user");

    const result = await dispatch(
      assignBuilding({
        user_id: selectedUser,
        building_id: buildingId,
        role,
      }),
    );

    if (assignBuilding.fulfilled.match(result)) {
      onClose();
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Assign Building</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <select
              className="form-select mb-3"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>

              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.display}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary w-100"
              onClick={handleAssign}
              disabled={loading}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
