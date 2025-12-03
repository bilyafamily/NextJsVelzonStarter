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
} from "reactstrap";
import { Key, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "@/hooks/user.hook";

interface ResetPasswordModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: any;
  onSuccess: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  toggle,
  user,
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain lowercase letter")
        .matches(/[A-Z]/, "Must contain uppercase letter")
        .matches(/[0-9]/, "Must contain number")
        .matches(/[@$!%*?&]/, "Must contain special character"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: values => {
      if (!user?.id) {
        alert("User not selected");
        return;
      }

      const passwordData = {
        userId: user.id,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      resetPasswordMutation.mutate(passwordData, {
        onSuccess: () => {
          validation.resetForm();
          onSuccess();
        },
      });
    },
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="border-0 pb-1">
        <div className="d-flex align-items-center gap-2">
          <Key size={20} />
          <div>
            <h5 className="mb-0">Reset Password</h5>
            <p className="text-muted small mb-0 mt-1">
              Reset password for {user?.fullName || "selected user"}
            </p>
          </div>
        </div>
      </ModalHeader>
      <Form onSubmit={validation.handleSubmit}>
        <ModalBody>
          {user && (
            <Alert color="info" className="mb-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="avatar-sm bg-info-subtle rounded-circle">
                    {user.fullName?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <strong>{user.fullName}</strong>
                  <div className="text-muted small">{user.email}</div>
                </div>
              </div>
            </Alert>
          )}

          <FormGroup>
            <Label for="newPassword" className="fw-semibold">
              New Password <span className="text-danger">*</span>
            </Label>
            <div className="position-relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={validation.values.newPassword}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={
                  validation.touched.newPassword &&
                  validation.errors.newPassword
                    ? true
                    : false
                }
                disabled={resetPasswordMutation.isPending}
              />
              <Button
                type="button"
                color="link"
                className="position-absolute end-0 top-50 translate-middle-y me-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {validation.touched.newPassword &&
              validation.errors.newPassword && (
                <FormFeedback>{validation.errors.newPassword}</FormFeedback>
              )}
          </FormGroup>

          <FormGroup>
            <Label for="confirmPassword" className="fw-semibold">
              Confirm Password <span className="text-danger">*</span>
            </Label>
            <div className="position-relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={validation.values.confirmPassword}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                invalid={
                  validation.touched.confirmPassword &&
                  validation.errors.confirmPassword
                    ? true
                    : false
                }
                disabled={resetPasswordMutation.isPending}
              />
              <Button
                type="button"
                color="link"
                className="position-absolute end-0 top-50 translate-middle-y me-2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {validation.touched.confirmPassword &&
              validation.errors.confirmPassword && (
                <FormFeedback>{validation.errors.confirmPassword}</FormFeedback>
              )}
          </FormGroup>

          <Alert color="warning" className="mt-3">
            <h6 className="alert-heading mb-2">Important!</h6>
            <p className="mb-0 small">
              The user will need to use this new password on their next login.
              They should change it immediately after logging in.
            </p>
          </Alert>

          {resetPasswordMutation.isPending && (
            <Alert color="info" className="mt-3">
              <Spinner size="sm" className="me-2" />
              Resetting password...
            </Alert>
          )}
        </ModalBody>
        <ModalFooter className="border-top-0">
          <Button
            color="secondary"
            onClick={toggle}
            disabled={resetPasswordMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            type="submit"
            disabled={!validation.isValid || resetPasswordMutation.isPending}
            className="d-flex align-items-center gap-2"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Spinner size="sm" />
                Resetting...
              </>
            ) : (
              <>
                <Key size={16} />
                Reset Password
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
