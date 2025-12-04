"use client";

import React, { useState, useEffect } from "react";
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
  Badge,
  Row,
  Col,
} from "reactstrap";
import { UserPlus, Eye, EyeOff, EditIcon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateUser, useUpdateUser } from "@/hooks/user.hook";
import { RoleDto, UserDto } from "@/types/user";

interface CreateUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  roles: RoleDto[];
  onSuccess: () => void;
  userToEdit?: any;
  setSelectedUser?: (data: UserDto) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  toggle,
  roles,
  onSuccess,
  userToEdit,
  setSelectedUser,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters"),
      lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters"),
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email"),
      phoneNumber: Yup.string(),
      password: Yup.string().when([], {
        is: () => !isEditMode,
        then: schema =>
          schema
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "Must contain lowercase letter")
            .matches(/[A-Z]/, "Must contain uppercase letter")
            .matches(/[0-9]/, "Must contain number")
            .matches(/[@$!%*?&]/, "Must contain special character"),
        otherwise: schema => schema.optional(),
      }),
      confirmPassword: Yup.string().when("password", {
        is: (val: string) => val && val.length > 0,
        then: schema =>
          schema
            .required("Please confirm your password")
            .oneOf([Yup.ref("password")], "Passwords must match"),
        otherwise: schema => schema.optional(),
      }),
    }),
    onSubmit: values => {
      if (isEditMode) {
        // Edit user
        const userData = {
          userId: values.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          roles: selectedRoles,
          ...(values.password && { password: values.password }),
        };

        updateUserMutation.mutateAsync(userData, {
          onSuccess: response => {
            if (response.isSuccess) {
              validation.resetForm();
              if (setSelectedUser) {
                setSelectedUser(response.result);
              }
              setSelectedRoles([]);
              setIsEditMode(false);
              onSuccess();
            } else {
              setErrorMessage(response.message);
            }
          },
        });
      } else {
        // Create user
        const userData = {
          ...values,
          roles: selectedRoles,
        };
        createUserMutation.mutateAsync(userData, {
          onSuccess: response => {
            if (response.isSuccess) {
              validation.resetForm();
              setSelectedRoles([]);
              onSuccess();
            } else {
              setErrorMessage(response.message);
            }
          },
        });
      }
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      validation.resetForm();
      setSelectedRoles([]);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setErrorMessage("");
      setIsEditMode(false);
    }
  }, [isOpen]);

  // Populate form when userToEdit changes
  useEffect(() => {
    if (userToEdit && isOpen) {
      setIsEditMode(true);
      validation.setValues({
        id: userToEdit.id || "",
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        email: userToEdit.email || "",
        phoneNumber: userToEdit.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
      setSelectedRoles(userToEdit.roles || []);
    }
  }, [userToEdit, isOpen]);

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;
  const isEditing = isEditMode && userToEdit;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          {isEditing ? <EditIcon size={20} /> : <UserPlus size={20} />}
          <div>
            <h5 className="mb-0">
              {isEditing ? "Edit User" : "Create New User"}
            </h5>
            <p className="text-muted small mb-0 mt-1">
              {isEditing
                ? `Update ${userToEdit.fullName}'s account details`
                : "Create a new user account with roles"}
            </p>
          </div>
        </div>
      </ModalHeader>
      <Form onSubmit={validation.handleSubmit}>
        <ModalBody>
          {errorMessage && (
            <Row>
              <Alert color="danger" className="material-shadow mb-4">
                <strong>{errorMessage}</strong>
              </Alert>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName" className="fw-semibold">
                  First Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={validation.values.firstName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.firstName && validation.errors.firstName
                      ? true
                      : false
                  }
                  disabled={isLoading}
                />
                {validation.touched.firstName &&
                  validation.errors.firstName && (
                    <FormFeedback>{validation.errors.firstName}</FormFeedback>
                  )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName" className="fw-semibold">
                  Last Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={validation.values.lastName}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.lastName && validation.errors.lastName
                      ? true
                      : false
                  }
                  disabled={isLoading}
                />
                {validation.touched.lastName && validation.errors.lastName && (
                  <FormFeedback>{validation.errors.lastName}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email" className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={validation.values.email}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.email && validation.errors.email
                      ? true
                      : false
                  }
                  disabled={isLoading || isEditing} // Email cannot be changed when editing
                />
                {validation.touched.email && validation.errors.email && (
                  <FormFeedback>{validation.errors.email}</FormFeedback>
                )}
                {isEditing && (
                  <div className="form-text text-muted">
                    Email cannot be changed
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phoneNumber" className="fw-semibold">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={validation.values.phoneNumber}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  disabled={isLoading}
                />
              </FormGroup>
            </Col>
          </Row>

          {!isEditing && (
            <>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="password" className="fw-semibold">
                      Password <span className="text-danger">*</span>
                    </Label>
                    <div className="position-relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        value={validation.values.password}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        color="link"
                        className="position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                    {validation.touched.password &&
                      validation.errors.password && (
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                      )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="confirmPassword" className="fw-semibold">
                      Confirm Password <span className="text-danger">*</span>
                    </Label>
                    <div className="position-relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={validation.values.confirmPassword}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched.confirmPassword &&
                          validation.errors.confirmPassword
                            ? true
                            : false
                        }
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        color="link"
                        className="position-absolute end-0 top-50 translate-middle-y me-2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </Button>
                    </div>
                    {validation.touched.confirmPassword &&
                      validation.errors.confirmPassword && (
                        <FormFeedback>
                          {validation.errors.confirmPassword}
                        </FormFeedback>
                      )}
                  </FormGroup>
                </Col>
              </Row>

              {/* Password Requirements (only shown for create mode) */}
              <Alert color="light" className="mt-3">
                <h6 className="alert-heading mb-2">Password Requirements:</h6>
                <ul className="mb-0 small">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character (@$!%*?&)</li>
                </ul>
              </Alert>
            </>
          )}

          {isEditing && (
            <Alert color="info" className="mt-3">
              <h6 className="alert-heading mb-2">Password Update (Optional)</h6>
              <p className="small mb-0">
                Leave the password fields empty if you don't want to change the
                password. If you enter a new password, it must meet the
                requirements.
              </p>
            </Alert>
          )}

          <FormGroup className="mt-3">
            <Label className="fw-semibold">Assign Roles</Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {roles.map(role => (
                <Badge
                  key={role.name}
                  color={
                    selectedRoles.includes(role.name) ? "success" : "primary"
                  }
                  pill
                  className="p-2 cursor-pointer"
                  onClick={() => toggleRole(role.name)}
                >
                  {role.name}
                </Badge>
              ))}
              {roles.length === 0 && (
                <Alert color="info" size="sm" className="mb-0">
                  No roles available. Create roles first.
                </Alert>
              )}
            </div>
            <div className="form-text text-muted mt-1">
              Click roles to assign them to the user
            </div>
          </FormGroup>

          {isLoading && (
            <Alert color="info" className="mt-3">
              <Spinner size="sm" className="me-2" />
              {isEditing ? "Updating user..." : "Creating user..."}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color={isEditing ? "primary" : "success"}
            type="submit"
            disabled={!validation.isValid || isLoading}
            className="d-flex align-items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEditing ? <EditIcon size={16} /> : <UserPlus size={16} />}
                {isEditing ? "Update User" : "Create User"}
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
