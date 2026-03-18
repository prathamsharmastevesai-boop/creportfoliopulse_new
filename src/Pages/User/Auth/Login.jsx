import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  LoginSubmit,
  agreeAUP,
  getPortfolios,
  selectPortfolio,
} from "../../../Networking/Admin/APIs/LoginAPIs";
import axiosInstance from "../../../Networking/Admin/APIs/AxiosInstance";
import RAGLoader from "../../../Component/Loader";
import {
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  User,
  ChevronRight,
} from "lucide-react";
import "./login.css";
import { AUP_CONTENT } from "../../../Component/ChatSystem/aupData";

const ROLE_CONFIG = {
  admin: { label: "Admin", color: "#dc2626", bg: "#fef2f2", icon: ShieldCheck },
  superuser: {
    label: "Super User",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: ShieldCheck,
  },
  user: { label: "User", color: "#0066cc", bg: "#eff6ff", icon: User },
};

const getRoleConfig = (role) =>
  ROLE_CONFIG[role] || {
    label: role,
    color: "#374151",
    bg: "#f3f4f6",
    icon: User,
  };

const AUPModal = ({
  modalBodyRef,
  handleScroll,
  isAtBottom,
  agreed,
  setAgreed,
  aupAgreeLoading,
  handleCancelAUP,
  handleAgreeAUP,
}) => (
  <div className="modal show d-block login-aup-overlay" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Acceptable Use Policy</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCancelAUP}
            disabled={aupAgreeLoading}
          />
        </div>
        <div
          className="modal-body login-aup-body"
          ref={modalBodyRef}
          onScroll={handleScroll}
        >
          <div dangerouslySetInnerHTML={{ __html: AUP_CONTENT }} />
          {!isAtBottom && (
            <div className="alert alert-info mt-3">
              Please scroll to the bottom to enable agreement.
            </div>
          )}
        </div>
        <div className="modal-footer d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="agreeCheck"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!isAtBottom || aupAgreeLoading}
            />
            <label className="form-check-label" htmlFor="agreeCheck">
              I have read and understand the AUP
            </label>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleCancelAUP}
              disabled={aupAgreeLoading}
            >
              Decline
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAgreeAUP}
              disabled={!agreed || aupAgreeLoading}
            >
              {aupAgreeLoading ? "Agreeing..." : "I Agree"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CompanySelectionScreen = ({
  portfolios,
  onSelect,
  onBack,
  selecting,
}) => {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 w-100 login-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="text-center mb-4">
              <h3 className="fw-medium text-white mb-1 login-portal-title">
                Bespoke AIR | Portfolio Pulse Secure Portal
              </h3>
              <p className="text-white mb-0 login-portal-subtitle">
                Select a company to continue
              </p>
            </div>

            <div className="card shadow-lg border-0 login-card">
              <div className="card-body p-3 p-md-4 border_radius">
                <div className="d-flex align-items-center mb-3">
                  <Building2 size={18} color="#0066cc" className="me-2" />
                  <h6 className="mb-0 fw-semibold login-companies-heading">
                    Your Companies ({portfolios.length})
                  </h6>
                </div>

                <div className="row g-3 mb-4">
                  {portfolios.map((portfolio) => {
                    const roleConf = getRoleConfig(portfolio.role);
                    const RoleIcon = roleConf.icon;
                    const isSelected =
                      selected?.company_id === portfolio.company_id;
                    const isHovered = hoveredId === portfolio.company_id;

                    return (
                      <div className="col-md-6" key={portfolio.company_id}>
                        <div
                          onClick={() => !selecting && setSelected(portfolio)}
                          onMouseEnter={() =>
                            setHoveredId(portfolio.company_id)
                          }
                          onMouseLeave={() => setHoveredId(null)}
                          className={[
                            "login-portfolio-card",
                            isSelected ? "login-portfolio-card--selected" : "",
                            isHovered && !isSelected
                              ? "login-portfolio-card--hovered"
                              : "",
                            selecting ? "login-portfolio-card--disabled" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {isSelected && (
                            <div className="login-portfolio-check">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                              >
                                <path
                                  d="M2 5L4.2 7.2L8 3"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="login-portfolio-icon">
                            <Building2 size={20} color="white" />
                          </div>

                          <p className="mb-1 fw-semibold text-dark login-portfolio-name">
                            {portfolio.company_name}
                          </p>

                          <span
                            className="login-role-badge"
                            style={{
                              background: roleConf.bg,
                              color: roleConf.color,
                            }}
                          >
                            <RoleIcon size={11} />
                            {roleConf.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={selecting}
                    className="btn btn-link p-0 text-decoration-none shadow-none login-back-btn"
                  >
                    ← Back to Login
                  </button>

                  <button
                    type="button"
                    onClick={() => selected && onSelect(selected)}
                    disabled={!selected || selecting}
                    className={[
                      "btn btn-primary fw-semibold d-flex align-items-center gap-2 login-continue-btn",
                      !selected || selecting
                        ? "login-continue-btn--disabled"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {selecting ? "Loading..." : "Continue"}
                    {!selecting && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState("login");
  const [portfolios, setPortfolios] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAUPModal, setShowAUPModal] = useState(false);
  const [aupVersion, setAupVersion] = useState("");
  const [aupAgreeLoading, setAupAgreeLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const modalBodyRef = useRef(null);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleScroll = () => {
    const el = modalBodyRef.current;
    if (el)
      setIsAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 5);
  };

  const validateForm = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email address";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const navigateBasedOnRole = (role) => {
    if (role === "user") navigate("/dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
    else if (role === "superuser") navigate("/admin-management");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await dispatch(
        LoginSubmit({ email: email.trim(), password: password.trim() }),
      ).unwrap();

      const { access_token, role, aup_required, aup_version } = res;

      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("role", role);

      if (role === "superuser") {
        toast.success("Login successful");
        navigate("/admin-management");
        return;
      }

      if (aup_required === true) {
        setAupVersion(aup_version || "");
        setShowAUPModal(true);
        setIsAtBottom(false);
        setAgreed(false);
        return;
      }

      const companies = await dispatch(getPortfolios()).unwrap();

      if (!companies || companies.length === 0) {
        toast.error("No companies found for your account.");
        return;
      }

      setPortfolios(companies);
      setStep("company-select");
    } catch (err) {
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = async (portfolio) => {
    setSelecting(true);

    try {
      const res = await dispatch(
        selectPortfolio({ company_id: portfolio.company_id }),
      ).unwrap();

      const { role } = res;

      sessionStorage.setItem("company_name", portfolio.company_name);

      toast.success("Login successful");
      navigateBasedOnRole(role);
    } catch (error) {
      toast.error(error);
    } finally {
      setSelecting(false);
    }
  };

  const handleAgreeAUP = async () => {
    setAupAgreeLoading(true);
    try {
      await dispatch(agreeAUP({ aup_version: aupVersion })).unwrap();

      toast.success("AUP agreed successfully");
      setShowAUPModal(false);

      const access_token = sessionStorage.getItem("access_token");

      const companiesRes = await axiosInstance.get("/auth/portfolios", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const companies = companiesRes.data;

      if (!companies || companies.length === 0) {
        toast.error("No companies found.");
        return;
      }

      setPortfolios(companies);
      setStep("company-select");
    } catch {
      toast.error("Failed to agree to AUP. Please try again.");
    } finally {
      setAupAgreeLoading(false);
    }
  };

  const handleCancelAUP = () => {
    sessionStorage.clear();
    setShowAUPModal(false);
    toast.info("You must agree to the AUP to continue.");
  };

  const handleBackToLogin = () => {
    sessionStorage.clear();
    setStep("login");
    setPortfolios([]);
  };

  if (step === "company-select") {
    return (
      <>
        <CompanySelectionScreen
          portfolios={portfolios}
          onSelect={handleCompanySelect}
          onBack={handleBackToLogin}
          selecting={selecting}
        />

        {selecting && (
          <div className="login-overlay-loader">
            <RAGLoader />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 w-100 login-bg login-bg--padded">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center mb-4">
              <h3 className="fw-medium text-white login-portal-title">
                Bespoke AIR | Portfolio Pulse Secure Portal
              </h3>
            </div>

            <div className="card shadow-lg border-0 login-card">
              <div className="card-body p-3 p-md-4">
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="form-label text-muted mb-2 small">
                      Username
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      style={{ borderRadius: "12px", fontSize: "1rem" }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted mb-2 small">
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                          borderRadius: "12px",
                          paddingRight: "45px",
                          fontSize: "1rem",
                        }}
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3 login-eye-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block small mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="text-end mb-2">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="btn btn-link p-0 text-decoration-none shadow-none login-forgot-btn"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold mb-4"
                    disabled={loading}
                    style={{
                      backgroundColor: "#0066cc",
                      borderRadius: "25px",
                      padding: "5px",
                      border: "none",
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="login-overlay-loader">
          <RAGLoader />
        </div>
      )}

      {showAUPModal && (
        <AUPModal
          modalBodyRef={modalBodyRef}
          handleScroll={handleScroll}
          isAtBottom={isAtBottom}
          agreed={agreed}
          setAgreed={setAgreed}
          aupAgreeLoading={aupAgreeLoading}
          handleCancelAUP={handleCancelAUP}
          handleAgreeAUP={handleAgreeAUP}
        />
      )}
    </div>
  );
};
