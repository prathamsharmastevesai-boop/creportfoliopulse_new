import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Loader2 } from "lucide-react";
import {
  fetchLoiTemplatesApi,
  fetchBuildingProfilesApi,
  uploadLoiTemplateApi,
  createBuildingProfileApi,
  updateBuildingProfileApi,
} from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import RAGLoader from "../../../../Component/Loader";

const BtnSpinner = () => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      border: "2px solid rgba(255,255,255,0.35)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "loi-spin 0.65s linear infinite",
      marginRight: 7,
      verticalAlign: "middle",
    }}
  />
);

const PanelOverlay = ({ visible }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        borderRadius: "inherit",
      }}
    >
      <RAGLoader />
    </div>
  );
};

const initialProfileState = {
  building_name: "",
  profile_label: "",
  target_base_rent: 0,
  target_free_rent_months: 0,
  target_escalation_pct: 0,
  target_term_years: 0,
  target_ti_psf: 0,
  target_ner: 0,
};

const SettingsSection = () => {
  const dispatch = useDispatch();
  const {
    templates,
    buildingProfiles,
    uploadLoading,
    templatesLoading,
    profilesLoading,
  } = useSelector((state) => state.adminLoiAudit);

  const [profileSubmitLoading, setProfileSubmitLoading] = useState(false);
  const [templatesRefetching, setTemplatesRefetching] = useState(false);
  const [profilesRefetching, setProfilesRefetching] = useState(false);

  const [templateName, setTemplateName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileForm, setProfileForm] = useState(initialProfileState);

  useEffect(() => {
    dispatch(fetchLoiTemplatesApi());
    dispatch(fetchBuildingProfilesApi());
  }, [dispatch]);

  const handleFileUpload = (e) => setSelectedFile(e.target.files[0]);

  const onTemplateSubmit = async () => {
    if (!selectedFile || !templateName) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("template_name", templateName);

    try {
      await dispatch(uploadLoiTemplateApi(formData)).unwrap();
      setTemplateName("");
      setSelectedFile(null);

      setTemplatesRefetching(true);
      await dispatch(fetchLoiTemplatesApi()).unwrap();
    } catch (err) {
      console.error("Template upload failed:", err);
    } finally {
      setTemplatesRefetching(false);
    }
  };

  const onProfileSubmit = async () => {
    setProfileSubmitLoading(true);
    try {
      if (profileForm.id) {
        await dispatch(
          updateBuildingProfileApi({
            profileId: profileForm.id,
            profileData: profileForm,
          }),
        ).unwrap();
      } else {
        await dispatch(createBuildingProfileApi(profileForm)).unwrap();
      }
      setProfileForm(initialProfileState);

      setProfilesRefetching(true);
      await dispatch(fetchBuildingProfilesApi()).unwrap();
    } catch (err) {
      console.error("Profile submit failed:", err);
    } finally {
      setProfileSubmitLoading(false);
      setProfilesRefetching(false);
    }
  };

  const templatePanelBusy = uploadLoading || templatesRefetching;
  const profileListBusy = profilesLoading || profilesRefetching;
  const submitBusy = profileSubmitLoading;

  return (
    <>
      <style>{`@keyframes loi-spin { to { transform: rotate(360deg); } }`}</style>

      <div className="loi-section-grid a5-grid">
        <div className="loi-column">
          <div className="col-header">
            <span className="col-title">Templates Management</span>
          </div>

          <div className="settings-panel" style={{ position: "relative" }}>
            <PanelOverlay visible={templatePanelBusy} />

            <div className="upload-box mt-3">
              <Upload size={32} className="mb-2" />
              <div>Upload New .docx Template</div>

              <input
                type="file"
                className="mt-2"
                onChange={handleFileUpload}
                disabled={uploadLoading}
              />

              <input
                type="text"
                placeholder="Template Name (e.g. Mule Law 40 Wall)"
                className="premium-select mt-2"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                disabled={uploadLoading}
              />

              <button
                className="primary-action-btn mt-3 w-100"
                onClick={onTemplateSubmit}
                disabled={uploadLoading || !selectedFile || !templateName}
              >
                {uploadLoading ? (
                  <>
                    <BtnSpinner />
                    Saving…
                  </>
                ) : (
                  "Save Template"
                )}
              </button>
            </div>

            <div className="templates-list mt-4">
              <div className="section-subtitle">ACTIVE TEMPLATES</div>

              <div
                className="templates-scroll-list"
                style={{ position: "relative" }}
              >
                {templatesLoading ? (
                  <div className="text-center py-4">
                    <RAGLoader />
                  </div>
                ) : templates.length > 0 ? (
                  templates.map((tpl) => (
                    <div key={tpl.template_id} className="template-item">
                      <span>{tpl.template_name}</span>
                      <span className="text-muted text-xs">
                        {new Date(tpl.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted text-center py-4">
                    No templates yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="loi-column col-span-2">
          <div className="col-header">
            <span className="col-title">Building Strategy Profiles</span>
          </div>

          <div
            className="settings-panel d-flex flex-column flex-md-row gallary"
            style={{ position: "relative" }}
          >
            <div
              className="profile-editor p-4 border-right"
              style={{ position: "relative" }}
            >
              <PanelOverlay visible={submitBusy} />

              <div className="section-subtitle">
                {profileForm.id ? "EDIT" : "CREATE"} PROFILE
              </div>

              <div className="form-field">
                <label>Building Name</label>
                <input
                  type="text"
                  value={profileForm.building_name}
                  disabled={submitBusy}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      building_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label>Profile Label (e.g. Standard, Legal, Aggressive)</label>
                <input
                  type="text"
                  value={profileForm.profile_label}
                  disabled={submitBusy}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      profile_label: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-2 gap-2">
                <div className="form-field">
                  <label>Target Base Rent</label>
                  <input
                    type="number"
                    value={profileForm.target_base_rent}
                    disabled={submitBusy}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        target_base_rent: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Target Free Rent (Months)</label>
                  <input
                    type="number"
                    value={profileForm.target_free_rent_months}
                    disabled={submitBusy}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        target_free_rent_months: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-2">
                <div className="form-field">
                  <label>Target Escalation (%)</label>
                  <input
                    type="number"
                    value={profileForm.target_escalation_pct}
                    disabled={submitBusy}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        target_escalation_pct: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-field">
                  <label>Target Term (Years)</label>
                  <input
                    type="number"
                    value={profileForm.target_term_years}
                    disabled={submitBusy}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        target_term_years: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Calculated Target NER</label>
                <input
                  type="number"
                  value={profileForm.target_ner}
                  disabled={submitBusy}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      target_ner: e.target.value,
                    })
                  }
                />
              </div>

              <button
                className="primary-action-btn w-100"
                onClick={onProfileSubmit}
                disabled={submitBusy}
              >
                {submitBusy ? (
                  <>
                    <BtnSpinner />
                    {profileForm.id ? "Updating…" : "Creating…"}
                  </>
                ) : profileForm.id ? (
                  "Update Profile"
                ) : (
                  "Create Profile"
                )}
              </button>

              {profileForm.id && (
                <button
                  className="mt-2 w-100"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: 6,
                    padding: "7px 0",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: 12,
                  }}
                  onClick={() => setProfileForm(initialProfileState)}
                  disabled={submitBusy}
                >
                  Cancel
                </button>
              )}
            </div>

            <div
              className="profiles-list p-4 bg-dark"
              style={{ position: "relative" }}
            >
              <PanelOverlay visible={profileListBusy && !profilesLoading} />

              <div className="section-subtitle">EXISTING STRATEGIES</div>

              <div className="profiles-scroll-list">
                {profilesLoading ? (
                  <div className="text-center py-5">
                    <RAGLoader />
                  </div>
                ) : buildingProfiles.length > 0 ? (
                  buildingProfiles.map((p) => (
                    <div key={p.id} className="profile-item-card">
                      <div className="p-info">
                        <div className="p-name">
                          {p.building_name} / {p.profile_label}
                        </div>
                        <div className="profile-summary">
                          NER ${p.target_ner} · Term {p.target_term_years}yr ·{" "}
                          {p.target_escalation_pct}%
                        </div>
                      </div>
                      <button
                        className="edit-btn"
                        onClick={() => setProfileForm(p)}
                        disabled={submitBusy}
                      >
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted py-5 text-center">No profiles</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSection;
