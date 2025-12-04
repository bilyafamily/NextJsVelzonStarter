"use client";

import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Alert,
} from "reactstrap";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit2,
  Key,
  UserCheck,
  UserX,
} from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: any;
  onEdit: (user: any) => void;
  onResetPassword: () => void;
  onToggleStatus: () => void;
  onManageRoles: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  toggle,
  user,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onManageRoles,
}) => {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          <User size={20} />
          <div>
            <h5 className="mb-0">User Details</h5>
            <p className="text-muted small mb-0 mt-1">
              View and manage user information
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        {/* User Header */}
        <div className="d-flex align-items-center mb-4">
          <div className="flex-shrink-0">
            <div
              className={`avatar-lg rounded-circle d-flex align-items-center justify-content-center ${
                user.isActive ? "bg-success-subtle" : "bg-danger-subtle"
              }`}
              style={{ width: 80, height: 80 }}
            >
              <span
                className={`fs-3 fw-bold ${user.isActive ? "text-success" : "text-danger"}`}
              >
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <div className="flex-grow-1 ms-4">
            <h4 className="mb-1">{user.fullName}</h4>
            <div className="d-flex align-items-center gap-3 mb-2">
              <Badge color={user.isActive ? "success" : "danger"} pill>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge color={user.emailConfirmed ? "success" : "warning"} pill>
                {user.emailConfirmed ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div className="text-muted">
              User ID: <code className="small">{user.id}</code>
            </div>
          </div>
        </div>

        {/* User Information */}
        <ListGroup flush className="mb-4">
          <ListGroupItem className="d-flex align-items-center py-3">
            <Mail size={16} className="me-3 text-muted" />
            <div>
              <div className="fw-semibold">Email Address</div>
              <div>{user.email}</div>
            </div>
          </ListGroupItem>

          {user.phoneNumber && (
            <ListGroupItem className="d-flex align-items-center py-3">
              <Phone size={16} className="me-3 text-muted" />
              <div>
                <div className="fw-semibold">Phone Number</div>
                <div>{user.phoneNumber}</div>
              </div>
            </ListGroupItem>
          )}

          <ListGroupItem className="d-flex align-items-center py-3">
            <Calendar size={16} className="me-3 text-muted" />
            <div>
              <div className="fw-semibold">Account Created</div>
              <div>{formatDate(user.createdAt)}</div>
            </div>
          </ListGroupItem>

          <ListGroupItem className="d-flex align-items-center py-3">
            <Shield size={16} className="me-3 text-muted" />
            <div>
              <div className="fw-semibold">Roles</div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {user.roles?.map((role: string) => (
                  <Badge key={role} color="primary" pill>
                    {role}
                  </Badge>
                ))}
                {(!user.roles || user.roles.length === 0) && (
                  <span className="text-muted">No roles assigned</span>
                )}
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>

        {/* Status Information */}
        <Alert color={user.isActive ? "success" : "danger"} className="mb-4">
          <div className="d-flex align-items-center">
            {user.isActive ? (
              <UserCheck size={20} className="me-3" />
            ) : (
              <UserX size={20} className="me-3" />
            )}
            <div>
              <h6 className="alert-heading mb-1">
                Account is {user.isActive ? "Active" : "Disabled"}
              </h6>
              <p className="mb-0 small">
                {user.isActive
                  ? "This user can log in and access the system."
                  : "This user cannot log in or access the system."}
              </p>
            </div>
          </div>
        </Alert>

        {/* Email Verification Status */}
        <Alert
          color={user.emailConfirmed ? "success" : "warning"}
          className="mb-4"
        >
          <div className="d-flex align-items-center">
            {user.emailConfirmed ? (
              <CheckCircle size={20} className="me-3" />
            ) : (
              <XCircle size={20} className="me-3" />
            )}
            <div>
              <h6 className="alert-heading mb-1">
                Email {user.emailConfirmed ? "Verified" : "Not Verified"}
              </h6>
              <p className="mb-0 small">
                {user.emailConfirmed
                  ? "This user has verified their email address."
                  : "This user has not verified their email address."}
              </p>
            </div>
          </div>
        </Alert>
      </ModalBody>
      <ModalFooter className="border-top-0">
        <div className="d-flex flex-wrap gap-2 w-100">
          <Button
            color="primary"
            onClick={() => onEdit(user)}
            className="d-flex align-items-center gap-2 flex-grow-1"
          >
            <Edit2 size={16} />
            Edit User
          </Button>
          <Button
            color="warning"
            onClick={onResetPassword}
            className="d-flex align-items-center gap-2 flex-grow-1"
          >
            <Key size={16} />
            Reset Password
          </Button>
          <Button
            color={user.isActive ? "danger" : "success"}
            onClick={onToggleStatus}
            className="d-flex align-items-center gap-2 flex-grow-1"
          >
            {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
            {user.isActive ? "Disable" : "Enable"}
          </Button>
          <Button
            color="info"
            onClick={onManageRoles}
            className="d-flex align-items-center gap-2 flex-grow-1"
          >
            <Shield size={16} />
            Manage Roles
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UserDetailsModal;
