"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Button,
  Badge,
  Spinner,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Shield, Search, Plus, X } from "lucide-react";
import { RoleDto } from "@/types/user";

interface ManageUserRolesModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: any;
  roles: RoleDto[];
  onAssignRole: (userId: string, roleName: string) => void;
  onRemoveRole: (userId: string, roleName: string) => void;
  onSuccess: () => void;
}

const ManageUserRolesModal: React.FC<ManageUserRolesModalProps> = ({
  isOpen,
  toggle,
  user,
  roles,
  onAssignRole,
  onRemoveRole,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Filter roles based on search query and exclude already assigned roles
  const availableRoles = roles.filter(
    role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user?.roles?.includes(role.name)
  );

  const assignedRoles = user?.roles || [];

  const handleAssignRole = async (roleName: string) => {
    if (!user?.id) return;

    setIsAssigning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onAssignRole(user.id, roleName);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    if (!user?.id) return;

    setIsRemoving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onRemoveRole(user.id, roleName);
    } finally {
      setIsRemoving(false);
    }
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setIsAssigning(false);
      setIsRemoving(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          <Shield size={20} />
          <div>
            <h5 className="mb-0">Manage User Roles</h5>
            <p className="text-muted small mb-0 mt-1">
              Assign or remove roles for {user?.fullName || "selected user"}
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        {user && (
          <Alert color="info" className="mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div
                    className="avatar-sm rounded-circle bg-info-subtle d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                  >
                    <span className="text-info fw-semibold">
                      {user.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <strong>{user.fullName}</strong>
                  <div className="text-muted small">{user.email}</div>
                </div>
              </div>
              <div className="text-muted small">
                ID: {user.id?.substring(0, 8)}...
              </div>
            </div>
          </Alert>
        )}

        {/* Current Roles */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Current Roles</h6>
          {assignedRoles.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {assignedRoles.map((roleName: string) => {
                const roleInfo = roles.find(r => r.name === roleName);
                return (
                  <Badge
                    key={roleName}
                    color="primary"
                    pill
                    className="p-2 d-flex align-items-center gap-2"
                  >
                    <Shield size={14} />
                    {roleName}
                    <Button
                      color="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={() => handleRemoveRole(roleName)}
                      disabled={isRemoving}
                      title={`Remove ${roleName} role`}
                    >
                      <X size={14} />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <Alert color="warning" className="mb-0">
              <div className="d-flex align-items-center">
                <Shield size={16} className="me-2" />
                <span>No roles assigned to this user</span>
              </div>
            </Alert>
          )}
          {isRemoving && (
            <div className="mt-2">
              <Spinner size="sm" className="me-2" />
              <small className="text-muted">Removing role...</small>
            </div>
          )}
        </div>

        {/* Available Roles */}
        <div>
          <h6 className="fw-semibold mb-3">Available Roles</h6>

          {/* Search */}
          <div className="mb-3">
            <InputGroup>
              <InputGroupText>
                <Search size={16} />
              </InputGroupText>
              <Input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                disabled={isAssigning || isRemoving}
              />
            </InputGroup>
          </div>

          {/* Available Roles List */}
          {availableRoles.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {availableRoles.map(role => (
                <Badge
                  key={role.name}
                  color="light"
                  pill
                  className="p-2 d-flex align-items-center gap-2 cursor-pointer border"
                  onClick={() => handleAssignRole(role.name)}
                  style={{ cursor: "pointer" }}
                  title={`Assign ${role.name} role`}
                >
                  <Shield size={14} />
                  {role.name}
                  <Plus size={14} />
                </Badge>
              ))}
            </div>
          ) : (
            <Alert color="info" className="mb-0">
              <div className="d-flex align-items-center">
                <Shield size={16} className="me-2" />
                <span>
                  {searchQuery
                    ? "No roles found matching your search"
                    : "All available roles are already assigned"}
                </span>
              </div>
            </Alert>
          )}

          {isAssigning && (
            <div className="mt-2">
              <Spinner size="sm" className="me-2" />
              <small className="text-muted">Assigning role...</small>
            </div>
          )}
        </div>

        {/* Role Statistics */}
        <Alert color="light" className="mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="text-center p-2">
                <div className="fw-semibold">{assignedRoles.length}</div>
                <small className="text-muted">Assigned Roles</small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-center p-2">
                <div className="fw-semibold">{availableRoles.length}</div>
                <small className="text-muted">Available Roles</small>
              </div>
            </div>
          </div>
        </Alert>
      </ModalBody>
      <ModalFooter className="border-top-0">
        <Button
          color="secondary"
          onClick={toggle}
          disabled={isAssigning || isRemoving}
        >
          Close
        </Button>
        <Button
          color="primary"
          onClick={onSuccess}
          disabled={isAssigning || isRemoving}
        >
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ManageUserRolesModal;
