import React from "react";

function SectionCard({ title, sub, children, className = "" }) {
  return (
    <div className={`tp-section-card ${className}`}>
      {title && <p className="tp-section-title">{title}</p>}
      {sub && <p className="tp-section-sub">{sub}</p>}
      {children}
    </div>
  );
}

export default SectionCard;
