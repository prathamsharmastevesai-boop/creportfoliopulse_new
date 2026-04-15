import React from "react";
import "./PageHeader.css";

const PageHeader = ({
  title,
  subtitle,
  actions,
  backButton,
  align = "start",
  className = "",
}) => {
  const headerClasses = [
    "custom-page-header",
    `text-center text-md-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={headerClasses}>
      <div className="custom-page-header-main d-flex align-items-center gap-3">
        {backButton && (
          <div className="custom-page-header-back">{backButton}</div>
        )}
        <div className="custom-page-header-content">
          <h4 className="fw-bold mx-5 mx-md-0">{title}</h4>
          {subtitle && <p className="text-muted small m-0 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="custom-page-header-actions mt-3 mt-md-0 d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
