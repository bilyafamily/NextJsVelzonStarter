"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import * as Yup from "yup";

//import images
const profileBg = "/images/profile-bg.jpg";
const avatar1 = "/images/users/user-dummy-img.jpg";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useChangePassword } from "src/hooks";
import { toast } from "react-toastify";
import { ResponseDto } from "src/types/common";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("1");
  const changePasswordMutation = useChangePassword();
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const { data: session } = useSession();

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  document.title = "Profile | NMDPRA - Profile Settings & Account Information";

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

  // Inside your component
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .notOneOf(
          [Yup.ref("oldPassword")],
          "New password must be different from old password"
        ),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      changePasswordMutation
        .mutateAsync({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
        .then((response: ResponseDto) => {
          if (response.statusCode === 400) {
            const message = response?.message || "Failed to change password.";
            setStatusMessage(message);
            setStatusType("error");
          } else {
            setStatusMessage("Password changed successfully!");
            setStatusType("success");
          }
        })
        .catch(error => {
          toast.error(error.error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  // Get password strength
  const passwordStrength = checkPasswordStrength(validation.values.newPassword);

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Render form fields with show/hide toggle
  const renderPasswordField = (
    field: "oldPassword" | "newPassword" | "confirmPassword",
    label: string,
    id: string,
    placeholder: string
  ) => (
    <div className="mb-3">
      <Label htmlFor={id} className="form-label">
        {label}
      </Label>
      <div className="input-group">
        <Input
          type={showPassword[field] ? "text" : "password"}
          className={`form-control ${
            validation.touched[field] && validation.errors[field]
              ? "is-invalid"
              : ""
          }`}
          id={id}
          name={field}
          placeholder={placeholder}
          value={validation.values[field]}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
        />
        <button
          className="btn btn-outline-success"
          type="button"
          onClick={() => togglePasswordVisibility(field)}
        >
          <i
            className={`${showPassword[field] ? "ri-eye-off-line" : "ri-eye-line"}`}
          />
        </button>
        {validation.touched[field] && validation.errors[field] && (
          <div className="invalid-feedback">{validation.errors[field]}</div>
        )}
      </div>

      {/* Password strength indicator for new password field */}
      {field === "newPassword" && validation.values.newPassword && (
        <div className="mt-2">
          <div className="d-flex align-items-center">
            <small className="me-2">Password strength:</small>
            <div className="progress flex-grow-1" style={{ height: "5px" }}>
              <div
                className={`progress-bar ${
                  passwordStrength.score >= 4
                    ? "bg-success"
                    : passwordStrength.score >= 3
                      ? "bg-warning"
                      : "bg-danger"
                }`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
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
    </div>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <Image
                src={profileBg}
                className="profile-wid-img"
                alt=""
                width={1920}
                height={300}
              />
              <div className="overlay-content">
                <div className="text-end p-3">
                  <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                    <Input
                      id="profile-foreground-img-file-input"
                      type="file"
                      className="profile-foreground-img-file-input"
                    />
                    <Label
                      htmlFor="profile-foreground-img-file-input"
                      className="profile-photo-edit btn btn-light"
                    >
                      <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                      Change Cover
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5 card-bg-fill">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      {session?.user.image ? (
                        <Image
                          src={session.user.image}
                          width={120}
                          height={120}
                          alt="user-profile"
                        />
                      ) : (
                        <Image
                          src={avatar1}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                          alt="user-profile"
                          width={120}
                          height={120}
                        />
                      )}
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">Anna Adame</h5>
                    <p className="text-muted mb-0">Lead Designer / Developer</p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-center mb-5">
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-0">Complete Your Profile</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href="#"
                        className="badge bg-light text-primary fs-12"
                      >
                        <i className="ri-edit-box-line align-bottom me-1"></i>{" "}
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="progress animated-progress custom-progress progress-label">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{ width: "30%" }}
                    >
                      <div className="label">30%</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5 card-bg-fill">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Personal Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Change Password
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                First Name
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="firstnameInput"
                                placeholder="Enter your firstname"
                                defaultValue="Dave"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="lastnameInput"
                                className="form-label"
                              >
                                Last Name
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="lastnameInput"
                                placeholder="Enter your lastname"
                                defaultValue="Adame"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="phonenumberInput"
                                className="form-label"
                              >
                                Phone Number
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="phonenumberInput"
                                placeholder="Enter your phone number"
                                defaultValue="+(1) 987 6543"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label"
                              >
                                Email Address
                              </Label>
                              <Input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="Enter your email"
                                defaultValue="daveadame@velzon.com"
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="JoiningdatInput"
                                className="form-label"
                              >
                                Joining Date
                              </Label>
                              <Flatpickr
                                className="form-control"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="skillsInput"
                                className="form-label"
                              >
                                Skills
                              </Label>
                              <select className="form-select mb-3">
                                <option>Select your Skill </option>
                                <option value="Choices1">CSS</option>
                                <option value="Choices2">HTML</option>
                                <option value="Choices3">PYTHON</option>
                                <option value="Choices4">JAVA</option>
                                <option value="Choices5">ASP.NET</option>
                              </select>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="designationInput"
                                className="form-label"
                              >
                                Designation
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="designationInput"
                                placeholder="Designation"
                                defaultValue="Lead Designer / Developer"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="websiteInput1"
                                className="form-label"
                              >
                                Website
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="websiteInput1"
                                placeholder="www.example.com"
                                defaultValue="www.velzon.com"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label htmlFor="cityInput" className="form-label">
                                City
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="cityInput"
                                placeholder="City"
                                defaultValue="California"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label
                                htmlFor="countryInput"
                                className="form-label"
                              >
                                Country
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="countryInput"
                                placeholder="Country"
                                defaultValue="United States"
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label
                                htmlFor="zipcodeInput"
                                className="form-label"
                              >
                                Zip Code
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                minLength={5}
                                maxLength={6}
                                id="zipcodeInput"
                                placeholder="Enter zipcode"
                                defaultValue="90011"
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="mb-3 pb-2">
                              <Label
                                htmlFor="exampleFormControlTextarea"
                                className="form-label"
                              >
                                Description
                              </Label>
                              <textarea
                                className="form-control"
                                id="exampleFormControlTextarea"
                                rows={3}
                                defaultValue="Hi I'm Anna Adame, It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is European languages are members of the same family."
                              ></textarea>
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <button type="button" className="btn btn-primary">
                                Updates
                              </button>
                              <button
                                type="button"
                                className="btn btn-soft-success"
                              >
                                Cancel
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId="2">
                      <Row>
                        {statusMessage && (
                          <div
                            className={`alert mt-3 ${
                              statusType === "success"
                                ? "alert-success"
                                : "alert-danger"
                            }`}
                            role="alert"
                          >
                            {statusMessage}
                          </div>
                        )}
                      </Row>
                      <Form onSubmit={validation.handleSubmit}>
                        <Row className="g-2">
                          <Col lg={4}>
                            {renderPasswordField(
                              "oldPassword",
                              "Old Password*",
                              "oldpasswordInput",
                              "Enter current password"
                            )}
                          </Col>

                          <Col lg={4}>
                            {renderPasswordField(
                              "newPassword",
                              "New Password*",
                              "newpasswordInput",
                              "Enter new password"
                            )}
                          </Col>

                          <Col lg={4}>
                            {renderPasswordField(
                              "confirmPassword",
                              "Confirm Password*",
                              "confirmpasswordInput",
                              "Confirm password"
                            )}
                          </Col>
                          <Col lg={12}>
                            <div className="mb-3">
                              <Link
                                href="#"
                                className="link-primary text-decoration-underline"
                              >
                                Forgot Password ?
                              </Link>
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success"
                                disabled={
                                  !validation.isValid ||
                                  changePasswordMutation.isPending ||
                                  !validation.dirty
                                }
                              >
                                {changePasswordMutation.isPending ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    />
                                    Changing Password...
                                  </>
                                ) : (
                                  "Change Password"
                                )}
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings;
