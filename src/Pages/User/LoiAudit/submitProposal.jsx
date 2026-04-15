import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitProposalApi } from "../../../Networking/User/APIs/LoiAudit/loiAuditApi";
import {
  Building2,
  CheckCircle2,
  Circle,
  ClipboardList,
  Layers,
  Send,
  Tag,
  UploadCloud,
  User,
} from "lucide-react";
import { Field, SectionLabel } from "./loiAudit";
import { toast } from "react-toastify";

export const SubmitProposal = () => {
  const [formDataState, setFormDataState] = useState({
    tenant_name: "",
    building: "",
    floor_suite: "",
    rsf: "",
    broker_name: "",

    broker_company: "",
    deal_tag: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const checklist = {
    pdf: !!file,
    tenantName: !!formDataState.tenant_name,
    building: !!formDataState.building,
  };

  const handleChange = (key, value) => {
    setFormDataState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!checklist.pdf || !checklist.tenantName || !checklist.building) {
        toast.error("Please fill required fields");
        setLoading(false);
        return;
      }
      const formData = new FormData();

      formData.append("tenant_name", formDataState.tenant_name);
      formData.append("floor_suite", formDataState.floor_suite);
      formData.append("rsf", formDataState.rsf);
      formData.append("deal_tag", formDataState.deal_tag);
      formData.append("broker_name", formDataState.broker_name);
      formData.append("building", formDataState.building);
      formData.append("broker_company", formDataState.broker_company);

      if (file) {
        formData.append("file", file);
      }

      await dispatch(submitProposalApi({ formData }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loi-tab-content">
      <div className="row g-4">
        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <div
            className="loi-upload-box"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <UploadCloud size={28} className="loi-upload-icon mb-2" />
            <div className="loi-upload-label">
              {file ? file.name : "Attach Tenant LOI PDF"}
            </div>
            <div className="loi-upload-sub">Click to browse</div>

            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <Field
            label="Tenant Name *"
            value={formDataState.tenant_name}
            onChange={(e) => handleChange("tenant_name", e.target.value)}
            icon={<User size={12} />}
            validate="string"
          />

          <Field
            label="Building *"
            value={formDataState.building}
            onChange={(e) => handleChange("building", e.target.value)}
            icon={<Building2 size={12} />}
            validate="string"
          />

          <Field
            label="Floor / Suite"
            value={formDataState.floor_suite}
            onChange={(e) => handleChange("floor_suite", e.target.value)}
            icon={<Layers size={12} />}
            validate="string"
          />

          <Field
            label="RSF"
            value={formDataState.rsf}
            onChange={(e) => handleChange("rsf", e.target.value)}
            icon={<Tag size={12} />}
            validate="integer"
          />
        </div>

        <div className="col-12 col-md-6 d-flex flex-column gap-3">
          <SectionLabel icon={<User size={11} />}>BROKER DETAILS</SectionLabel>

          <Field
            label="Broker Name"
            value={formDataState.broker_name}
            onChange={(e) => handleChange("broker_name", e.target.value)}
            icon={<User size={12} />}
            validate="string"
          />

          <Field
            label="Broker Company"
            value={formDataState.broker_company}
            onChange={(e) => handleChange("broker_company", e.target.value)}
            icon={<Building2 size={12} />}
            validate="string"
          />

          <Field
            label="Deal Tag (unique ID)"
            value={formDataState.deal_tag}
            onChange={(e) => handleChange("deal_tag", e.target.value)}
            icon={<Tag size={12} />}
          />

          <div className="loi-checklist-box">
            <div className="loi-checklist-title">
              <ClipboardList size={12} className="me-2" />
              Submission Checklist
            </div>

            {Object.entries({
              "PDF uploaded": checklist.pdf,
              "Tenant name filled": checklist.tenantName,
              "Building filled": checklist.building,
            }).map(([label, done]) => (
              <div key={label} className="loi-check-row">
                {done ? (
                  <CheckCircle2 size={13} className="loi-check-done" />
                ) : (
                  <Circle size={13} className="loi-check-pending" />
                )}
                <span
                  className={
                    done ? "loi-check-text-done" : "loi-check-text-pending"
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="loi-btn-primary d-flex align-items-center gap-2"
          >
            <Send size={13} />
            {loading ? "Submitting..." : "Submit Proposal to Landlord"}
          </button>
        </div>
      </div>
    </div>
  );
};
