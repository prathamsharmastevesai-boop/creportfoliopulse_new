import React, { forwardRef } from "react";
import "./Card.css";

const Card = forwardRef(
  (
    {
      children,
      title,
      subtitle,
      headerAction,
      headerClass = "",
      footer,
      image,
      className = "",
      bodyClass = "",
      bodyStyle = {},
      onClick,
      noPadding = false,
      variant = "default",
      direction = "column",
      animation = "",
      style = {},
      ...props
    },
    ref,
  ) => {
    const cardClasses = [
      "custom-card",
      `card-variant-${variant}`,
      `card-direction-${direction}`,
      animation,
      onClick ? "card-clickable" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const bodyClasses = ["custom-card-body", noPadding ? "p-0" : "", bodyClass]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        style={style}
        {...props}
      >
        {image && (
          <div className="custom-card-img-wrapper">
            <img
              src={image}
              alt={typeof title === "string" ? title : "card"}
              className="custom-card-img"
            />
          </div>
        )}

        {(title || subtitle || headerAction) && (
          <div className={`custom-card-header ${headerClass}`}>
            <div className="custom-card-title-group">
              {title && <h3 className="custom-card-title">{title}</h3>}
              {subtitle && (
                <span className="custom-card-subtitle">{subtitle}</span>
              )}
            </div>
            {headerAction && (
              <div className="custom-card-action">{headerAction}</div>
            )}
          </div>
        )}

        <div className={bodyClasses} style={bodyStyle}>
          {children}
        </div>

        {footer && <div className="custom-card-footer">{footer}</div>}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
