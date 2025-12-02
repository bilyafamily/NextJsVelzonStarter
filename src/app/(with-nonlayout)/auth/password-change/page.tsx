"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../../authinner/ParticlesAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useResetPassword } from "src/hooks";

const logoLight = "/images/logo.png";

const PasswordChange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  document.title = "Create New Password | NMDPRA";

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPasswordShow, setConfirmPasswordShow] =
    useState<boolean>(false);

  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>("");

  const resetPasswordMutation = useResetPassword();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidationError("Reset token is missing from the URL.");
        setIsValidating(false);
        setIsTokenValid(false);
        toast.error("Invalid reset link. Please request a new password reset.");
        return;
      }

      if (!email) {
        setValidationError("Email is missing from the URL.");
        setIsValidating(false);
        setIsTokenValid(false);
        toast.error("Invalid reset link. Please request a new password reset.");
        return;
      }

      try {
        setIsValidating(true);
        const response = await fetch(
          `/api/auth/verify-reset-token?token=${token}&email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Invalid or expired token");
        }

        const data = await response.json();

        if (data.isSuccess) {
          setIsTokenValid(true);
          toast.success(
            "Token verified successfully. You can now set your new password."
          );
        } else {
          throw new Error(data.message || "Invalid token");
        }
      } catch (error: any) {
        setIsTokenValid(false);
        setValidationError(error.message || "Failed to validate reset token");
        toast.error(
          error.message ||
            "Invalid or expired reset link. Please request a new password reset."
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Must contain at least one special character (@$!%*?&)"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!token || !email) {
        toast.error("Invalid reset link parameters.");
        return;
      }

      try {
        setSubmitting(true);
        await resetPasswordMutation
          .mutateAsync({
            token,
            email,
            newPassword: values.password,
          })
          .then(() => {
            router.push("/auth/login");
          });
      } catch (error) {
        // Error is handled by the mutation hook
        console.error("Reset password error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Show loading state while validating token
  if (isValidating) {
    return (
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4 text-center">
                    <div className="my-5">
                      <Spinner color="primary" className="mb-3" />
                      <h5 className="text-primary">Validating Reset Link</h5>
                      <p className="text-muted">
                        Please wait while we verify your reset link...
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <div className="avatar-lg mx-auto">
                        <div className="avatar-title bg-light text-danger display-5 rounded-circle">
                          <i className="ri-error-warning-line"></i>
                        </div>
                      </div>
                      <div className="mt-4 pt-2">
                        <h4>Invalid Reset Link</h4>
                        <p className="text-muted">{validationError}</p>
                        <div className="mt-4">
                          <button
                            className="w-100 btn btn-success w-100"
                            onClick={() => router.push("/auth/forgot-password")}
                          >
                            <i className="ri-refresh-line align-middle me-1"></i>
                            Request New Reset Link
                          </button>
                        </div>
                        <div className="mt-3">
                          <Link
                            href="/auth/login"
                            className="text-success fw-semibold"
                          >
                            <i className="ri-arrow-left-line align-middle me-1"></i>
                            Back to Login
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </ParticlesAuth>
    );
  }

  // Show password reset form if token is valid
  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/#" className="d-inline-block auth-logo">
                    <Image
                      src={logoLight}
                      alt="NMDPRA Logo"
                      width={32}
                      height={32}
                    />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">NMDPRA Admin Dashboard</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {validationError && (
                <Alert color="danger" className="mb-3">
                  <i className="ri-error-warning-line align-middle me-1"></i>
                  {validationError}
                </Alert>
              )}

              <Card className="mt-4 card-bg-fill">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create New Password</h5>
                    <p className="text-muted">
                      Your new password must be different from previous used
                      passwords.
                    </p>
                    {email && (
                      <div className="alert alert-info" role="alert">
                        <i className="ri-user-line align-middle me-1"></i>
                        Resetting password for: <strong>{email}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <Form onSubmit={validation.handleSubmit}>
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="password-input">
                          New Password
                        </Label>
                        <div className="position-relative auth-pass-inputgroup">
                          <Input
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Enter new password"
                            id="password-input"
                            name="password"
                            value={validation.values.password}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            disabled={resetPasswordMutation.isPending}
                            invalid={
                              validation.errors.password &&
                              validation.touched.password
                                ? true
                                : false
                            }
                          />
                          {validation.errors.password &&
                          validation.touched.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                          <Button
                            color="link"
                            onClick={() => setPasswordShow(!passwordShow)}
                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                            type="button"
                            disabled={resetPasswordMutation.isPending}
                          >
                            <i
                              className={`ri-eye${passwordShow ? "-off" : ""}-fill align-middle`}
                            ></i>
                          </Button>
                        </div>
                        <div id="passwordInput" className="form-text">
                          Must be at least 8 characters with uppercase,
                          lowercase, number, and special character.
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="confirm-password-input"
                        >
                          Confirm New Password
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            type={confirmPasswordShow ? "text" : "password"}
                            className="form-control pe-5 password-input"
                            placeholder="Confirm new password"
                            id="confirm-password-input"
                            name="confirmPassword"
                            value={validation.values.confirmPassword}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            disabled={resetPasswordMutation.isPending}
                            invalid={
                              validation.errors.confirmPassword &&
                              validation.touched.confirmPassword
                                ? true
                                : false
                            }
                          />
                          {validation.errors.confirmPassword &&
                          validation.touched.confirmPassword ? (
                            <FormFeedback type="invalid">
                              {validation.errors.confirmPassword}
                            </FormFeedback>
                          ) : null}
                          <Button
                            color="link"
                            onClick={() =>
                              setConfirmPasswordShow(!confirmPasswordShow)
                            }
                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none"
                            type="button"
                            disabled={resetPasswordMutation.isPending}
                          >
                            <i
                              className={`ri-eye${confirmPasswordShow ? "-off" : ""}-fill align-middle`}
                            ></i>
                          </Button>
                        </div>
                      </div>

                      {/* Password Requirements Checklist */}
                      <div className="p-3 bg-light mb-3 rounded">
                        <h6 className="fs-13 mb-2">Password Requirements:</h6>
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className={`ri-${validation.values.password.length >= 8 ? "check" : "close"}-circle-fill text-${validation.values.password.length >= 8 ? "success" : "danger"} me-2`}
                          ></i>
                          <span className="fs-12">At least 8 characters</span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className={`ri-${/[a-z]/.test(validation.values.password) ? "check" : "close"}-circle-fill text-${/[a-z]/.test(validation.values.password) ? "success" : "danger"} me-2`}
                          ></i>
                          <span className="fs-12">
                            At least one lowercase letter
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className={`ri-${/[A-Z]/.test(validation.values.password) ? "check" : "close"}-circle-fill text-${/[A-Z]/.test(validation.values.password) ? "success" : "danger"} me-2`}
                          ></i>
                          <span className="fs-12">
                            At least one uppercase letter
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className={`ri-${/[0-9]/.test(validation.values.password) ? "check" : "close"}-circle-fill text-${/[0-9]/.test(validation.values.password) ? "success" : "danger"} me-2`}
                          ></i>
                          <span className="fs-12">At least one number</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i
                            className={`ri-${/[@$!%*?&]/.test(validation.values.password) ? "check" : "close"}-circle-fill text-${/[@$!%*?&]/.test(validation.values.password) ? "success" : "danger"} me-2`}
                          ></i>
                          <span className="fs-12">
                            At least one special character (@$!%*?&)
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          className="w-100"
                          type="submit"
                          disabled={
                            !validation.isValid ||
                            !validation.dirty ||
                            resetPasswordMutation.isPending
                          }
                        >
                          {resetPasswordMutation.isPending ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Resetting Password...
                            </>
                          ) : (
                            <>
                              <i className="ri-refresh-line align-middle me-1"></i>
                              Reset Password
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Remembered your password?{" "}
                  <Link
                    href="/authinner/signin/basic"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </ParticlesAuth>
  );
};

export default PasswordChange;
