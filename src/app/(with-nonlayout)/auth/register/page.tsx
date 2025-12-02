"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
  Button,
  Spinner,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { registerUser, resetRegisterFlag } from "@slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Link from "next/link";

//import images
const logoLight = "/images/logo.png";
import Image from "next/image";
import { useRegister } from "src/services/auth.service";
import { ResponseDto } from "src/types/common";
import { useRouter } from "next/navigation";

const Register = () => {
  const [success, setIsSuccess] = useState(false);
  const [error, setIsError] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const registerMutation = useRegister();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      firstname: Yup.string().required("Please Enter Your Firstname"),
      lastname: Yup.string().required("Please Enter Your Lastname"),
      password: Yup.string().required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""])
        .required("Confirm Password is required"),
    }),
    onSubmit: values => {
      registerMutation
        .mutateAsync({
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          password: values.password,
        })
        .then((response: ResponseDto) => {
          if (response.isSuccess) {
            setIsSuccess(true);
            validation.resetForm();
            router.replace("/auth/login");
          } else {
            setIsError(response.message);
          }
        })
        .finally(() => {
          setIsSuccess(false);
        });
    },
  });

  const checkPasswordStrength = (password: string) => {
    const strength = {
      score: 0,
      feedback: "",
    };

    if (password.length >= 8) strength.score++;
    if (/[a-z]/.test(password)) strength.score++;
    if (/[A-Z]/.test(password)) strength.score++;
    if (/[0-9]/.test(password)) strength.score++;
    if (/[@$!%*?&]/.test(password)) strength.score++;

    return strength;
  };

  // Get password strength
  const passwordStrength = checkPasswordStrength(validation.values.password);

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  document.title = "Register | NMDPRA";

  return (
    <React.Fragment>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
                    <Image src={logoLight} alt="" height={80} width={80} />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium text-success">
                  The Authority
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {success && (
                <Alert color="success" style={{ marginTop: "13px" }}>
                  Please confirm your account by clicking on the link sent to
                  your registered email
                </Alert>
              )}
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Create New Account</h5>
                  </div>
                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={e => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                      className="needs-validation"
                      action="#"
                    >
                      {error ? (
                        <Alert color="danger">
                          <div>
                            Email has been Register Before, Please Use Another
                            Email Address...{" "}
                          </div>
                        </Alert>
                      ) : null}

                      <div className="mb-3">
                        <Label htmlFor="useremail" className="form-label">
                          Email <span className="text-danger">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email address"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.email}</div>
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="firstname" className="form-label">
                          Firstname <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="firstname"
                          type="text"
                          placeholder="Enter firstname"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.firstname || ""}
                          invalid={
                            validation.touched.firstname &&
                            validation.errors.firstname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.firstname &&
                        validation.errors.firstname ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.firstname}</div>
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="lastname" className="form-label">
                          Lastname <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="lastname"
                          type="text"
                          placeholder="Enter lastname"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lastname || ""}
                          invalid={
                            validation.touched.lastname &&
                            validation.errors.lastname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.lastname &&
                        validation.errors.lastname ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.lastname}</div>
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </Label>
                        <div className="input-group">
                          <Input
                            type={
                              showPassword["password"] ? "text" : "password"
                            }
                            className={`form-control ${
                              validation.touched.password &&
                              validation.errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                            name="password"
                            placeholder={"Enter password"}
                            value={validation.values.password || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          />
                          <button
                            className="btn btn-outline-success"
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                          >
                            <i
                              className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"}`}
                            />
                          </button>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      {/* Password strength indicator for new password field */}
                      {validation.values.password && (
                        <div className="mt-2">
                          <div className="d-flex align-items-center">
                            <small className="me-2">Password strength:</small>
                            <div
                              className="progress flex-grow-1"
                              style={{ height: "5px" }}
                            >
                              <div
                                className={`progress-bar ${
                                  passwordStrength.score >= 4
                                    ? "bg-success"
                                    : passwordStrength.score >= 3
                                      ? "bg-warning"
                                      : "bg-danger"
                                }`}
                                style={{
                                  width: `${(passwordStrength.score / 5) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <small className="text-muted">
                            {passwordStrength.score >= 4
                              ? "Strong password"
                              : passwordStrength.score >= 3
                                ? "Moderate password"
                                : "Weak password"}
                          </small>
                        </div>
                      )}

                      <div className="mb-2">
                        <Label htmlFor="confirmPassword" className="form-label">
                          Confirm Password{" "}
                          <span className="text-danger">*</span>
                        </Label>
                        <div className="input-group">
                          <Input
                            type={
                              showPassword["confirmPassword"]
                                ? "text"
                                : "password"
                            }
                            className={`form-control ${
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? "is-invalid"
                                : ""
                            }`}
                            name="confirm_password"
                            placeholder={"Confirm password"}
                            value={validation.values.confirm_password || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          />
                          <button
                            className="btn btn-outline-success"
                            type="button"
                            onClick={() =>
                              togglePasswordVisibility("confirmPassword")
                            }
                          >
                            <i
                              className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"}`}
                            />
                          </button>
                        </div>

                        {validation.touched.confirm_password &&
                        validation.errors.confirm_password ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.confirm_password}</div>
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        <Button
                          color="success"
                          className="w-100"
                          type="submit"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending && (
                            <Spinner size="sm" className="me-2">
                              {" "}
                              Loading...{" "}
                            </Spinner>
                          )}
                          Sign Up
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title text-muted">
                            Create account with
                          </h5>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-icon waves-effect waves-light"
                          >
                            <i className="ri-facebook-fill fs-16"></i>
                          </button>{" "}
                          <button
                            type="button"
                            className="btn btn-danger btn-icon waves-effect waves-light"
                          >
                            <i className="ri-google-fill fs-16"></i>
                          </button>{" "}
                          <button
                            type="button"
                            className="btn btn-dark btn-icon waves-effect waves-light"
                          >
                            <i className="ri-github-fill fs-16"></i>
                          </button>{" "}
                          <button
                            type="button"
                            className="btn btn-info btn-icon waves-effect waves-light"
                          >
                            <i className="ri-twitter-fill fs-16"></i>
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Already have an account ?{" "}
                  <Link
                    href="/auth/login"
                    className="fw-semibold text-primary "
                  >
                    {" "}
                    Signin{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
