// components/users/CreateRoleModal.tsx
"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
  Spinner,
  ListGroup,
  ListGroupItem,
  Badge,
} from "reactstrap";
import { ShieldPlus, Shield, Check, X, Info } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateRole, useGetRoles } from "@/hooks/user.hook";

interface CreateRoleModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  toggle,
  onSuccess,
}) => {
  const [roleName, setRoleName] = useState("");
  const { data: existingRoles = [], refetch: refetchRoles } = useGetRoles();
  const createRoleMutation = useCreateRole();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      roleName: "",
    },
    validationSchema: Yup.object({
      roleName: Yup.string()
        .required("Role name is required")
        .min(2, "Role name must be at least 2 characters")
        .max(50, "Role name cannot exceed 50 characters")
        .matches(
          /^[a-zA-Z0-9\s\-_]+$/,
          "Role name can only contain letters, numbers, spaces, hyphens, and underscores"
        )
        .test(
          "unique-role",
          "This role already exists",
          value =>
            !existingRoles.some(
              role => role.name.toLowerCase() === value?.toLowerCase()
            )
        ),
    }),
    onSubmit: values => {
      createRoleMutation.mutate(values.roleName, {
        onSuccess: () => {
          validation.resetForm();
          refetchRoles();
          onSuccess();
        },
      });
    },
  });

  // Suggested roles based on common patterns
  const suggestedRoles = [
    { name: "Manager", description: "Can manage team members and resources" },
    { name: "Editor", description: "Can create and edit content" },
    { name: "Viewer", description: "Can view but not edit content" },
    { name: "Auditor", description: "Can review and audit system activities" },
    { name: "Support", description: "Can provide technical support" },
    { name: "Analyst", description: "Can access analytics and reports" },
  ];

  const handleSelectSuggestedRole = (roleName: string) => {
    validation.setFieldValue("roleName", roleName);
  };

  const isRoleUnique = (roleName: string) => {
    return !existingRoles.some(
      role => role.name.toLowerCase() === roleName.toLowerCase()
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          <ShieldPlus size={20} />
          <div>
            <h5 className="mb-0">Create New Role</h5>
            <p className="text-muted small mb-0 mt-1">
              Create a new role with specific permissions
            </p>
          </div>
        </div>
      </ModalHeader>
      <Form onSubmit={validation.handleSubmit}>
        <ModalBody>
          {/* Role Name Input */}
          <FormGroup>
            <Label for="roleName" className="fw-semibold">
              Role Name <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="roleName"
              name="roleName"
              placeholder="e.g., ContentManager, DataAnalyst, SystemAdmin"
              value={validation.values.roleName}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.roleName && validation.errors.roleName
                  ? true
                  : false
              }
              disabled={createRoleMutation.isPending}
            />
            {validation.touched.roleName && validation.errors.roleName ? (
              <FormFeedback>{validation.errors.roleName}</FormFeedback>
            ) : (
              <div className="form-text text-muted">
                Use descriptive names (e.g., "ContentManager" instead of "CM")
              </div>
            )}
          </FormGroup>

          {/* Role Validation Status */}
          {validation.values.roleName && (
            <Alert
              color={
                isRoleUnique(validation.values.roleName) ? "success" : "danger"
              }
              className="py-2"
            >
              <div className="d-flex align-items-center">
                {isRoleUnique(validation.values.roleName) ? (
                  <>
                    <Check size={16} className="me-2" />
                    <span>Role name is available</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="me-2" />
                    <span>Role name already exists</span>
                  </>
                )}
              </div>
            </Alert>
          )}

          {/* Suggested Roles */}
          <div className="mt-4">
            <h6 className="fw-semibold mb-3">
              <Info size={16} className="me-2" />
              Suggested Roles
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {suggestedRoles.map(role => (
                <Badge
                  key={role.name}
                  color="light"
                  pill
                  className="p-2 d-flex align-items-center gap-2 cursor-pointer border"
                  onClick={() => handleSelectSuggestedRole(role.name)}
                  style={{ cursor: "pointer" }}
                  title={role.description}
                >
                  <Shield size={14} />
                  {role.name}
                </Badge>
              ))}
            </div>
            <div className="form-text text-muted mt-2">
              Click on a suggested role to select it
            </div>
          </div>

          {/* Existing Roles */}
          {existingRoles.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-semibold mb-3">Existing Roles</h6>
              <ListGroup flush>
                {existingRoles.slice(0, 5).map(role => (
                  <ListGroupItem
                    key={role.name}
                    className="d-flex justify-content-between align-items-center py-2"
                  >
                    <div className="d-flex align-items-center">
                      <Shield size={14} className="me-2 text-muted" />
                      <span>{role.name}</span>
                    </div>
                    <Badge color="secondary" pill>
                      {role.userCount || 0} users
                    </Badge>
                  </ListGroupItem>
                ))}
                {existingRoles.length > 5 && (
                  <ListGroupItem className="text-center py-2 text-muted small">
                    + {existingRoles.length - 5} more roles
                  </ListGroupItem>
                )}
              </ListGroup>
            </div>
          )}

          {/* Best Practices */}
          <Alert color="info" className="mt-4">
            <h6 className="alert-heading mb-2">Best Practices</h6>
            <ul className="mb-0 small">
              <li>Use clear, descriptive names (e.g., "FinanceManager")</li>
              <li>Follow naming conventions (PascalCase recommended)</li>
              <li>Avoid special characters except hyphens and underscores</li>
              <li>Consider role hierarchy and permissions</li>
            </ul>
          </Alert>

          {/* Loading State */}
          {createRoleMutation.isPending && (
            <Alert color="info" className="mt-3">
              <Spinner size="sm" className="me-2" />
              Creating role...
            </Alert>
          )}
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button
            color="secondary"
            onClick={toggle}
            disabled={createRoleMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="success"
            type="submit"
            disabled={!validation.isValid || createRoleMutation.isPending}
            className="d-flex align-items-center gap-2"
          >
            {createRoleMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Creating...
              </>
            ) : (
              <>
                <ShieldPlus size={16} />
                Create Role
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CreateRoleModal;
