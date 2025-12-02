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
  Alert,
  Spinner,
} from "reactstrap";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParticlesAuth from "../ParticlesAuth";

const logoLight = "/images/logo.png";

const AccountConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  document.title = "Confirm Your Account | NMDPRA ";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmationStatus, setConfirmationStatus] = useState<{
    success: boolean;
    message: string;
  }>({ success: false, message: "" });

  // Handle account confirmation
  useEffect(() => {
    const confirmAccount = async () => {
      if (!token || !email) {
        setConfirmationStatus({
          success: false,
          message: "Confirmation link is missing required parameters.",
        });
        setIsLoading(false);
        toast.error("Invalid confirmation link.");
        return;
      }

      try {
        setIsLoading(true);

        // Call your API to confirm the account
        const response = await fetch("/api/auth/confirm-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to confirm account");
        }

        if (data.isSuccess) {
          setConfirmationStatus({
            success: true,
            message:
              data.message || "Your account has been confirmed successfully!",
          });
          toast.success("Account confirmed successfully!");
        } else {
          throw new Error(data.message || "Account confirmation failed");
        }
      } catch (error: any) {
        setConfirmationStatus({
          success: false,
          message:
            error.message || "An error occurred while confirming your account.",
        });
        toast.error(error.message || "Failed to confirm account.");
      } finally {
        setIsLoading(false);
      }
    };

    confirmAccount();
  }, [token, email, router]);

  // Show loading state
  if (isLoading) {
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
                      <h5 className="text-primary">Confirming Your Account</h5>
                      <p className="text-muted">
                        Please wait while we confirm your account...
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

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
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
              <Card className="mt-4 card-bg-fill">
                <CardBody className="p-4">
                  {confirmationStatus.success ? (
                    <div className="text-center">
                      {/* Success State */}
                      <div className="avatar-lg mx-auto">
                        <div className="avatar-title bg-light text-success display-5 rounded-circle">
                          <i className="ri-checkbox-circle-line"></i>
                        </div>
                      </div>
                      <div className="mt-4 pt-2">
                        <h4>Account Confirmed!</h4>
                        <p className="text-muted mb-4">
                          {confirmationStatus.message}
                        </p>

                        {/* Additional Success Information */}
                        <Alert color="success" className="text-start">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <i className="ri-information-line fs-16"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="alert-heading mb-1">Next Steps</h6>
                              <p className="mb-0">
                                Your account is now active. You can sign in to
                                access the dashboard.
                              </p>
                            </div>
                          </div>
                        </Alert>

                        {/* User Info Card */}
                        {email && (
                          <Card className="border border-success-subtle mb-4">
                            <CardBody>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-sm">
                                  <div className="avatar-title bg-success-subtle text-success rounded fs-18">
                                    <i className="ri-user-line"></i>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-1">Account Details</h6>
                                  <p className="text-muted mb-0">
                                    Email: <strong>{email}</strong>
                                  </p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4">
                          <Link
                            className="w-100 mb-2 btn btn-success"
                            href={"/auth/login"}
                          >
                            <i className="ri-login-box-line align-middle me-1"></i>
                            Sign In Now
                          </Link>

                          <Button
                            color="light"
                            className="w-100"
                            onClick={() => router.push("/")}
                          >
                            <i className="ri-home-line align-middle me-1"></i>
                            Go to Homepage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {/* Error State */}
                      <div className="avatar-lg mx-auto">
                        <div className="avatar-title bg-light text-danger display-5 rounded-circle">
                          <i className="ri-error-warning-line"></i>
                        </div>
                      </div>
                      <div className="mt-4 pt-2">
                        <h4>Confirmation Failed</h4>
                        <p className="text-muted mb-4">
                          {confirmationStatus.message}
                        </p>

                        {/* Possible reasons */}
                        <Alert color="danger" className="text-start mb-4">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <i className="ri-alert-line fs-16"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="alert-heading mb-1">
                                Possible Reasons
                              </h6>
                              <ul className="mb-0 ps-3">
                                <li>The confirmation link has expired</li>
                                <li>The link has already been used</li>
                                <li>Invalid or malformed confirmation token</li>
                                <li>Account may already be confirmed</li>
                              </ul>
                            </div>
                          </div>
                        </Alert>

                        {/* Solutions */}
                        <Card className="border border-light mb-4">
                          <CardBody>
                            <h6 className="mb-3">
                              <i className="ri-lightbulb-line text-warning align-middle me-1"></i>
                              What to do next?
                            </h6>
                            <div className="vstack gap-2">
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2">
                                  <span className="badge bg-primary rounded-circle p-1">
                                    <i className="ri-mail-line fs-12"></i>
                                  </span>
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-0">
                                    Check your email for a new confirmation link
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2">
                                  <span className="badge bg-info rounded-circle p-1">
                                    <i className="ri-customer-service-line fs-12"></i>
                                  </span>
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-0">
                                    Contact support if you continue to have
                                    issues
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex align-items-start">
                                <div className="flex-shrink-0 me-2">
                                  <span className="badge bg-success rounded-circle p-1">
                                    <i className="ri-login-box-line fs-12"></i>
                                  </span>
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-0">
                                    Try signing in - your account might already
                                    be active
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>

                        {/* Action Buttons */}
                        <div className="mt-4">
                          <Button
                            color="primary"
                            className="w-100 mb-2"
                            onClick={() =>
                              router.push("/auth/resend-confirmation")
                            }
                          >
                            <i className="ri-mail-send-line align-middle me-1"></i>
                            Resend Confirmation Email
                          </Button>

                          <Button
                            color="light"
                            className="w-100 mb-2"
                            onClick={() => router.push("/auth/login")}
                          >
                            <i className="ri-login-box-line align-middle me-1"></i>
                            Try Signing In
                          </Button>

                          <Button
                            color="secondary"
                            className="w-100"
                            onClick={() => router.push("/")}
                          >
                            <i className="ri-home-line align-middle me-1"></i>
                            Return to Homepage
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Additional Links */}
              <div className="mt-4 text-center">
                <p className="text-muted mb-0">
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="fw-semibold text-decoration-underline"
                  >
                    Contact Support
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

export default AccountConfirmation;
