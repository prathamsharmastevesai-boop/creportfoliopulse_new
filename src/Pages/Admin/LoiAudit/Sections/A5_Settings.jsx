import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, Plus, Loader2 } from "lucide-react";
import {
  fetchLoiTemplatesApi,
  fetchBuildingProfilesApi,
  uploadLoiTemplateApi,
  createBuildingProfileApi,
  updateBuildingProfileApi,
} from "../../../../Networking/Admin/APIs/AdminLoiAuditApi";
import RAGLoader from "../../../../Component/Loader";

const SettingsSection = () => {
  const dispatch = useDispatch();
  const {
    templates,
    buildingProfiles,
    uploadLoading,
    templatesLoading,
    profilesLoading,
  } = useSelector((state) => state.adminLoiAudit);

  const [templateName, setTemplateName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
  const [profileForm, setProfileForm] = useState(initialProfileState);

  useEffect(() => {
    dispatch(fetchLoiTemplatesApi());
    dispatch(fetchBuildingProfilesApi());
  }, [dispatch]);

  const handleFileUpload = (e) => setSelectedFile(e.target.files[0]);

  const onTemplateSubmit = () => {
    if (!selectedFile || !templateName) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("template_name", templateName);
    dispatch(uploadLoiTemplateApi(formData)).then(() => {
      setTemplateName("");
      dispatch(fetchLoiTemplatesApi());
    });
  };

  const onProfileSubmit = () => {
    if (profileForm.id) {
      dispatch(
        updateBuildingProfileApi({
          profileId: profileForm.id,
          profileData: profileForm,
        }),
      ).then(() => {
        dispatch(fetchBuildingProfilesApi());
        setProfileForm(initialProfileState);
      });
    } else {
      dispatch(createBuildingProfileApi(profileForm)).then(() => {
        dispatch(fetchBuildingProfilesApi());
        setProfileForm(initialProfileState);
      });
    }
  };

  return (
    <div className="loi-section-grid a5-grid">
      <div className="loi-column">
        <div className="col-header">
          <span className="col-title">Templates Management</span>
        </div>
        <div className="settings-panel">
          <div className="upload-box mt-3">
            <Upload size={32} className="mb-2" />
            <div>Upload New .docx Template</div>
            <input type="file" className="mt-2" onChange={handleFileUpload} />
            <input
              type="text"
              placeholder="Template Name (e.g. Mule Law 40 Wall)"
              className="premium-select mt-2"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button
              className="primary-action-btn mt-3 w-100"
              onClick={onTemplateSubmit}
              disabled={uploadLoading || !selectedFile || !templateName}
            >
              {uploadLoading ? <>Saving...</> : "Save Template"}
            </button>
          </div>

          <div className="templates-list mt-4">
            <div className="section-subtitle">ACTIVE TEMPLATES</div>
            <div className="templates-scroll-list">
              {templatesLoading ? (
                <div className="text-center py-4">
                  <RAGLoader />
                </div>
              ) : (
                templates.map((tpl) => (
                  <div key={tpl.template_id} className="template-item">
                    <span>{tpl.template_name}</span>
                    <span className="text-muted text-xs">
                      {new Date(tpl.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="loi-column col-span-2">
        <div className="col-header">
          <span className="col-title">Building Strategy Profiles</span>
        </div>
        <div className="settings-panel d-flex flex-column flex-md-row gallary">
          <div className="profile-editor p-4 border-right">
            <div className="section-subtitle">
              {profileForm.id ? "EDIT" : "CREATE"} PROFILE
            </div>
            <div className="form-field">
              <label>Building Name</label>
              <input
                type="text"
                value={profileForm.building_name}
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
                onChange={(e) =>
                  setProfileForm({ ...profileForm, target_ner: e.target.value })
                }
              />
            </div>

            <button
              className="primary-action-btn w-100"
              onClick={onProfileSubmit}
            >
              {profileForm.id ? "Update Profile" : "Create Profile"}
            </button>
          </div>

          <div className="profiles-list p-4 bg-dark">
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
  );
};

export default SettingsSection;
