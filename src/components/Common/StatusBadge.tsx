import React from "react";
import { Badge } from "reactstrap";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "published"
  | "archived";

interface StatusBadgeProps {
  status: boolean | StatusType;
  customText?: string;
  showIcon?: boolean;
  iconSize?: "sm" | "md" | "lg";
  className?: string;
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  variant?: "solid" | "light" | "outline";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customText,
  showIcon = true,
  iconSize = "sm",
  className = "",
  size = "md",
  pill = true,
  variant = "light",
}) => {
  // Determine status configuration
  const getStatusConfig = () => {
    // Handle boolean status
    if (typeof status === "boolean") {
      return status
        ? {
            text: customText || "Active",
            color: "success",
            icon: "ri-checkbox-circle-line",
            variantColor: "success",
          }
        : {
            text: customText || "Inactive",
            color: "secondary",
            icon: "ri-close-circle-line",
            variantColor: "secondary",
          };
    }

    // Handle string status types
    const statusConfigs: Record<StatusType, any> = {
      active: {
        text: "Active",
        color: "success",
        icon: "ri-checkbox-circle-line",
        variantColor: "success",
      },
      inactive: {
        text: "Inactive",
        color: "secondary",
        icon: "ri-close-circle-line",
        variantColor: "secondary",
      },
      pending: {
        text: "Pending",
        color: "warning",
        icon: "ri-time-line",
        variantColor: "warning",
      },
      approved: {
        text: "Approved",
        color: "success",
        icon: "ri-check-double-line",
        variantColor: "success",
      },
      rejected: {
        text: "Rejected",
        color: "danger",
        icon: "ri-close-line",
        variantColor: "danger",
      },
      draft: {
        text: "Draft",
        color: "info",
        icon: "ri-edit-line",
        variantColor: "info",
      },
      published: {
        text: "Published",
        color: "primary",
        icon: "ri-global-line",
        variantColor: "primary",
      },
      archived: {
        text: "Archived",
        color: "dark",
        icon: "ri-archive-line",
        variantColor: "dark",
      },
    };

    return statusConfigs[status] || statusConfigs.inactive;
  };

  const config = getStatusConfig();
  const finalText = customText || config.text;

  // Size mappings
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizeClasses = {
    sm: "0.75em",
    md: "0.875em",
    lg: "1em",
  };

  // Variant styling
  const getVariantStyle = () => {
    const baseClass = `d-inline-flex align-items-center ${sizeClasses[size]} ${
      pill ? "rounded-pill" : "rounded"
    } ${className}`;

    if (variant === "solid") {
      return {
        className: `${baseClass} bg-${config.color} text-white border-0`,
        style: {},
      };
    }

    if (variant === "outline") {
      return {
        className: `${baseClass} bg-transparent text-${config.color} border border-${config.color}`,
        style: {},
      };
    }

    // Light variant (default)
    return {
      className: `${baseClass} bg-${config.color}-subtle text-${config.color}-emphasis border border-${config.color}-subtle`,
      style: {},
    };
  };

  const variantStyle = getVariantStyle();

  return (
    <div className={variantStyle.className} style={variantStyle.style}>
      {showIcon && (
        <i
          className={`${config.icon} me-1`}
          style={{ fontSize: iconSizeClasses[iconSize] }}
        ></i>
      )}
      <span className="fw-medium">{finalText}</span>
    </div>
  );
};

// Export helper function for standalone use
export const getStatusBadge = (isActive: boolean) => {
  return (
    <StatusBadge status={isActive} showIcon={true} size="sm" variant="light" />
  );
};

export default StatusBadge;
