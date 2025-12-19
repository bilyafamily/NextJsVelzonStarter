"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { useDispatch } from "react-redux";
import Link from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";

import { loginUser, socialLogin, resetLoginFlag } from "@slices/thunks";
const logoLight = "/images/logo.png";

import Image from "next/image";

const Login = () => {
  const searchParams = useSearchParams();

  const dispatch: any = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "bilyafamily@gmail.com",
      password: "MotheR$12@",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: "/dashboard",
      })
        .then(result => {
          if (result?.error) {
            setLoader(false);
            alert("Login failed. Please check your credentials.");
          } else {
            router.push("/dashboard");
          }
        })
        .catch(error => {
          setError(error.message || "An unexpected error occurred");
          setLoader(false);
        });
      setLoader(true);
    },
  });

  const handleAzureLogin = async () => {
    await signIn("microsoft-entra-id", {
      redirect: true,
      redirectTo: "/admin/dashboard",
    });
  };

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link href="/" className="d-inline-block auth-logo">
                      <Image src={logoLight} alt="" height={80} width={80} />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">The Authority</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">Sign in to continue.</p>
                    </div>
                    {error && <Alert color="danger">{error}</Alert>}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={e => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              !!validation.errors.email
                            }
                          />
                          {validation.touched.email &&
                            validation.errors.email && (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            )}
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link
                              href="/forgot-password"
                              className="text-muted"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                !!validation.errors.password
                              }
                            />
                            {validation.touched.password &&
                              validation.errors.password && (
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
                                </FormFeedback>
                              )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <Link href={"/auth/forgot-password"}>
                          <p className="text-success">Forget Password?</p>
                        </Link>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loader}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {loader && (
                              <Spinner size="sm" className="me-2">
                                Loading...
                              </Spinner>
                            )}
                            Sign In
                          </Button>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={loader}
                            className="btn btn-info w-100"
                            onClick={handleAzureLogin}
                          >
                            {/* {loader && (
                              <Spinner size="sm" className="me-2">
                                Loading...
                              </Spinner>
                            )} */}
                            Staff Login
                          </Button>
                        </div>

                        {/* <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Sign In with</h5>
                          </div>
                          <div>
                            <Link
                              href="#"
                              className="btn btn-primary btn-icon me-1"
                              onClick={e => {
                                e.preventDefault();
                              }}
                            >
                              <i className="ri-facebook-fill fs-16" />
                            </Link>
                            <Link
                              href="#"
                              className="btn btn-danger btn-icon me-1"
                              onClick={e => {
                                e.preventDefault();
                              }}
                            >
                              <i className="ri-google-fill fs-16" />
                            </Link>
                            <Button color="dark" className="btn-icon">
                              <i className="ri-github-fill fs-16"></i>
                            </Button>{" "}
                            <Button color="info" className="btn-icon">
                              <i className="ri-twitter-fill fs-16"></i>
                            </Button>
                          </div>
                        </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      Signup
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
