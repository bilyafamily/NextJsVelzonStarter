"use client";

import React from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Alert,
  Badge,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import {
  ShieldAlert,
  Home,
  ArrowLeft,
  Lock,
  ShieldOff,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function UnauthorizedPage() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="page-content bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Header with Icon */}
            <div className="text-center mb-5">
              <div className="position-relative d-inline-block mb-4">
                <div className="avatar-lg rounded-circle bg-danger bg-opacity-10 p-4">
                  <div className="avatar-sm rounded-circle bg-danger bg-opacity-20 p-3">
                    <ShieldOff size={40} className="text-danger" />
                  </div>
                </div>
                <Badge
                  color="warning"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill fs-6 px-3 py-2"
                  pill
                >
                  403
                </Badge>
              </div>

              <h1 className="display-5 fw-bold text-dark mb-3">
                Access Denied
              </h1>
              <p className="text-muted fs-5">
                You don&apos;t have permission to access this resource.
              </p>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-danger bg-gradient border-0 py-4">
                <div className="d-flex align-items-center text-white">
                  <Lock size={24} className="me-3" />
                  <h5 className="mb-0">Restricted Area</h5>
                </div>
              </CardHeader>

              <CardBody className="p-4 p-md-5">
                {/* Main Alert */}
                <Alert
                  color="danger"
                  className="border-0 bg-danger bg-opacity-10"
                >
                  <div className="d-flex">
                    <AlertCircle
                      size={20}
                      className="me-3 text-danger flex-shrink-0 mt-1"
                    />
                    <div>
                      <h5 className="alert-heading text-danger mb-2">
                        Unauthorized Access Attempt
                      </h5>
                      <p className="mb-0">
                        Your account lacks the necessary permissions to view
                        this page. Please contact your administrator if you
                        believe this is an error.
                      </p>
                    </div>
                  </div>
                </Alert>

                {/* Reasons List */}
                <div className="mb-5">
                  <h6 className="fw-semibold mb-3 text-dark">
                    <ShieldAlert size={18} className="me-2" />
                    Possible Reasons:
                  </h6>
                  <ListGroup flush>
                    <ListGroupItem className="border-0 px-0 py-2">
                      <div className="d-flex align-items-start">
                        <Badge color="danger" pill className="me-3">
                          1
                        </Badge>
                        <div>
                          <span className="fw-medium">
                            Missing Role/Permission
                          </span>
                          <p className="text-muted small mb-0">
                            Your account doesn&apos;t have the required role or
                            permission level.
                          </p>
                        </div>
                      </div>
                    </ListGroupItem>

                    <ListGroupItem className="border-0 px-0 py-2">
                      <div className="d-flex align-items-start">
                        <Badge color="danger" pill className="me-3">
                          2
                        </Badge>
                        <div>
                          <span className="fw-medium">Session Expired</span>
                          <p className="text-muted small mb-0">
                            Your authentication session may have expired. Please
                            sign in again.
                          </p>
                        </div>
                      </div>
                    </ListGroupItem>

                    <ListGroupItem className="border-0 px-0 py-2">
                      <div className="d-flex align-items-start">
                        <Badge color="danger" pill className="me-3">
                          3
                        </Badge>
                        <div>
                          <span className="fw-medium">Restricted Content</span>
                          <p className="text-muted small mb-0">
                            This area is restricted to specific user groups or
                            departments.
                          </p>
                        </div>
                      </div>
                    </ListGroupItem>
                  </ListGroup>
                </div>

                {/* Action Buttons */}
                <Row className="g-3">
                  <Col md={6}>
                    <Link href="/" className="text-decoration-none">
                      <Button
                        color="primary"
                        className="w-100 py-3 fw-medium d-flex align-items-center justify-content-center"
                      >
                        <Home size={18} className="me-2" />
                        Go to Homepage
                      </Button>
                    </Link>
                  </Col>

                  <Col md={6}>
                    <Button
                      color="outline-secondary"
                      className="w-100 py-3 fw-medium d-flex align-items-center justify-content-center"
                      onClick={handleGoBack}
                    >
                      <ArrowLeft size={18} className="me-2" />
                      Go Back
                    </Button>
                  </Col>
                </Row>

                {/* Request Access Section */}
                <div className="mt-5 pt-4 border-top">
                  <div className="text-center">
                    <h6 className="fw-semibold mb-3">Need Access?</h6>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                      <Link href="/contact" className="text-decoration-none">
                        <Button color="success" outline className="px-4">
                          <Mail size={16} className="me-2" />
                          Request Access
                        </Button>
                      </Link>

                      <Link href="/support" className="text-decoration-none">
                        <Button color="info" outline className="px-4">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Technical Information */}
                <div className="mt-5 pt-4 border-top">
                  <div className="text-center">
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-3">
                      <Badge color="light" className="text-dark border">
                        Error Code: 403
                      </Badge>
                      <Badge color="light" className="text-dark border">
                        Status: FORBIDDEN
                      </Badge>
                      <Badge color="light" className="text-dark border">
                        ID: {Date.now().toString(36).toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-0">
                      Timestamp: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                © {new Date().getFullYear()} Your Application. All rights
                reserved.
                <Link href="/privacy" className="text-decoration-none ms-2">
                  Privacy Policy
                </Link>
                <span className="mx-2">•</span>
                <Link href="/terms" className="text-decoration-none">
                  Terms of Service
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
