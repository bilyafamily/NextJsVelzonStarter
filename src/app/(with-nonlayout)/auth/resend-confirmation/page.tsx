// app/auth/resend-confirmation/page.tsx
"use client";
import React, { useState } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResendConfirmation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    }),
    onSubmit: async values => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/auth/resend-confirmation-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to resend confirmation email"
          );
        }

        if (data.isSuccess) {
          setIsSubmitted(true);
          toast.success(data?.message);
          validation.resetForm();
        } else {
          toast.error(data.message);
          throw new Error(data.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to resend confirmation email");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="auth-page-content mt-lg-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="mt-4 card-bg-fill">
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-success">Resend Confirmation Email</h5>
                  <p className="text-muted">
                    Enter your email address to receive a new confirmation link
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-4">
                    <div className="avatar-lg mx-auto">
                      <div className="avatar-title bg-light text-success display-5 rounded-circle">
                        <i className="ri-mail-send-line"></i>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4>Check Your Email</h4>
                      <p className="text-muted mb-4">
                        We've sent a new confirmation link to{" "}
                        <strong>{validation.values.email}</strong>. Please check
                        your inbox and follow the instructions.
                      </p>
                      <Alert color="info" className="text-start">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <i className="ri-information-line"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="alert-heading">
                              Didn't receive the email?
                            </h6>
                            <ul className="mb-0 ps-3">
                              <li>Check your spam or junk folder</li>
                              <li>Verify the email address is correct</li>
                              <li>Wait a few minutes and try again</li>
                            </ul>
                          </div>
                        </div>
                      </Alert>
                      <div className="mt-4">
                        <Button
                          color="success"
                          className="w-100 mb-2"
                          onClick={() => setIsSubmitted(false)}
                        >
                          <i className="ri-refresh-line align-middle me-1"></i>
                          Resend Again
                        </Button>
                        <Link
                          href="/auth/login"
                          className="btn btn-light w-100"
                        >
                          <i className="ri-login-box-line align-middle me-1"></i>
                          Back to Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="email-input">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        id="email-input"
                        name="email"
                        value={validation.values.email}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        disabled={isLoading}
                        invalid={
                          validation.errors.email && validation.touched.email
                            ? true
                            : false
                        }
                      />
                      {validation.errors.email && validation.touched.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <Button
                        color="success"
                        className="w-100"
                        type="submit"
                        disabled={!validation.isValid || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="ri-mail-send-line align-middle me-1"></i>
                            Resend Confirmation
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </CardBody>
            </Card>

            <div className="mt-4 text-center">
              <p className="text-muted mb-0">
                Remembered your account?{" "}
                <Link
                  href="/auth/login"
                  className="fw-semibold text-success text-decoration-underline"
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
  );
};

export default ResendConfirmation;
