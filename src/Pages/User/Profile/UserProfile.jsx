import React, { useEffect, useRef, useState } from "react";
import {
  getProfileDetail,
  ProfileUpdateApi,
} from "../../../Networking/User/APIs/Profile/ProfileApi";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import RAGLoader from "../../../Component/Loader";
import { capitalFunction } from "../../../Component/capitalLetter";
import "./profile.css";
const truncate = (str, max = 35) =>
  str && str.length > max ? str.slice(0, max) + "…" : str;

const ROLE_CONFIG = {
  owner: { label: "Owner", cls: "up-role--owner", icon: "👑" },
  admin: { label: "Admin", cls: "up-role--admin", icon: "🛡️" },
  superuser: { label: "Super Admin", cls: "up-role--admin", icon: "⚡" },
  user: { label: "User", cls: "up-role--user", icon: "👤" },
};

const InfoRow = ({ icon: Icon, label, value, mono = false, delay = 0 }) => (
  <div className="up-info-row" style={{ animationDelay: `${delay}ms` }}>
    <div className="up-info-icon-wrap">
      <Icon size={12} />
    </div>
    <div className="up-info-body">
      <span className="up-info-label">{label}</span>
      <span className={`up-info-value${mono ? " up-mono" : ""}`}>
        {value || "—"}
      </span>
    </div>
  </div>
);

const Field = ({ label, children, error, hint }) => (
  <div className="up-field">
    <label className="up-field-label">{label}</label>
    {children}
    {error && <div className="up-field-error">{error}</div>}
    {hint && !error && <div className="up-field-hint">{hint}</div>}
  </div>
);

export const UserProfile = () => {
  const { userdata } = useSelector((state) => state.ProfileSlice);
  const dispatch = useDispatch();
  const photoInputRef = useRef(null);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [company, setCompany] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const is_owner_admin = sessionStorage.getItem("is_owner_admin") === "true";
  console.log(is_owner_admin, "is_owner_admin");

  const roleConf = ROLE_CONFIG[userdata?.role] || ROLE_CONFIG.user;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        await dispatch(getProfileDetail());
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (userdata) {
      setName(userdata.name || "");
      setNumber(userdata.number || "");
      setCompany(userdata.company_name || "");
      setPhotoPreview(userdata.photo_url || null);
    }
  }, [userdata]);

  const cancelEditing = () => {
    setName(userdata?.name || "");
    setNumber(userdata?.number || "");
    setCompany(userdata?.company_name || "");
    setPhotoFile(null);
    setPhotoPreview(userdata?.photo_url || null);
    setIsEditing(false);
    setErrors({});
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    else if (name.trim().length < 3) errs.name = "At least 3 characters";
    else if (name.trim().length > 35) errs.name = "Max 35 characters";

    if (!number.trim()) errs.number = "Phone is required";
    else if (!/^\d+$/.test(number)) errs.number = "Digits only";
    else if (number.length < 10 || number.length > 15)
      errs.number = "10–15 digits";

    if (is_owner_admin && company.trim().length > 35)
      errs.company = "Max 35 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);
    if (is_owner_admin) formData.append("company_name", company);
    if (photoFile) formData.append("photo", photoFile);

    try {
      await dispatch(ProfileUpdateApi(formData));
      dispatch(getProfileDetail());
      setIsEditing(false);
      setPhotoFile(null);
      setErrors({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const initials = name
    ? name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "?";

  return (
    <div className="up-root">
      {loadingProfile ? (
        <div className="up-loader-wrap">
          <RAGLoader />
          <p className="up-loader-text">Loading profile…</p>
        </div>
      ) : (
        <div className="up-card up-animate-in">
          <div className="up-cover">
            <div className="up-cover-pattern" aria-hidden />

            <div className="up-cover-actions">
              {!isEditing ? (
                <button
                  className="up-icon-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit profile"
                >
                  <FaEdit size={13} />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  className="up-icon-btn up-icon-btn--cancel"
                  onClick={cancelEditing}
                  title="Cancel"
                >
                  <FaTimes size={13} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          <div className="up-avatar-zone">
            <div className="up-avatar-wrap">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Avatar"
                  className="up-avatar-img"
                />
              ) : (
                <div className="up-avatar-initials">{initials}</div>
              )}
              {isEditing && (
                <>
                  <button
                    type="button"
                    className="up-avatar-cam"
                    onClick={() => photoInputRef.current?.click()}
                    title="Change photo"
                  >
                    <FaCamera size={11} />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>

            <div className="up-identity">
              <h5 className="up-display-name">
                {truncate(capitalFunction(name)) || "—"}
              </h5>
              <span className={`up-role-badge ${roleConf.cls}`}>
                <span className="up-role-icon">{roleConf.icon}</span>
                {roleConf.label}
              </span>
            </div>
          </div>

          <div className="up-body">
            <form onSubmit={handleProfileUpdate} noValidate>
              {!isEditing && (
                <div className="up-info-list">
                  <InfoRow
                    icon={FaEnvelope}
                    label="Email"
                    value={userdata?.email}
                    delay={60}
                  />
                  <InfoRow
                    icon={FaPhone}
                    label="Phone"
                    value={userdata?.number}
                    delay={120}
                    mono
                  />
                  <InfoRow
                    icon={FaBuilding}
                    label="Company"
                    value={truncate(userdata?.company_name)}
                    delay={180}
                  />
                </div>
              )}

              {isEditing && (
                <div className="up-edit-grid">
                  <Field label="Full Name" error={errors.name}>
                    <input
                      value={name}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.length > 35) return;
                        setName(v);
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`up-input${errors.name ? " up-input--err" : ""}`}
                      placeholder="Your full name"
                    />
                  </Field>

                  <Field label="Phone Number" error={errors.number}>
                    <input
                      value={number}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setNumber(v);
                        setErrors((prev) => ({ ...prev, number: "" }));
                      }}
                      className={`up-input up-mono${errors.number ? " up-input--err" : ""}`}
                      placeholder="10–15 digits"
                      maxLength={15}
                    />
                  </Field>

                  <Field
                    label="Company Name"
                    error={errors.company}
                    hint={
                      !is_owner_admin ? "Only the owner can edit this field." : null
                    }
                  >
                    <input
                      value={truncate(company)}
                      onChange={
                        is_owner_admin === true
                          ? (e) => {
                            const v = e.target.value;
                            if (v.length > 35) return;
                            setCompany(v);
                            setErrors((prev) => ({ ...prev, company: "" }));
                          }
                          : undefined
                      }
                      readOnly={!is_owner_admin}
                      disabled={!is_owner_admin}
                      className={`up-input${!is_owner_admin ? " up-input--readonly" : ""}${errors.company ? " up-input--err" : ""}`}
                      placeholder="Company name"
                    />
                  </Field>

                  <Field label="Email" hint="Email cannot be changed.">
                    <input
                      value={userdata?.email || ""}
                      readOnly
                      disabled
                      className="up-input up-input--readonly"
                    />
                  </Field>

                  <div className="up-action-row">
                    <button
                      type="submit"
                      className="up-btn up-btn--primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="up-spinner" />
                      ) : (
                        <FaSave size={11} />
                      )}
                      {loading ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </form>


          </div>
        </div>
      )}
    </div>
  );
};
