"use client";

import React from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { Lock, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SimpleUnauthorizedPage() {
  const router = useRouter();
  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5} xl={4}>
          <Card className="border-0 shadow">
            <CardBody className="p-5 text-center">
              {/* Icon */}
              <div className="mb-4">
                <div className="avatar-lg rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center">
                  <Lock size={48} className="text-danger" />
                </div>
              </div>

              {/* Title */}
              <h2 className="fw-bold mb-3">Access Denied</h2>

              {/* Message */}
              <p className="text-muted mb-4">
                You don&apos;t have permission to access this page. Please
                contact your administrator for assistance.
              </p>

              {/* Error Code */}
              <Alert color="light" className="border mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Error Code:</span>
                  <span className="fw-bold text-danger">403</span>
                </div>
              </Alert>

              {/* Actions */}
              <div className="d-grid gap-2">
                <Link href="/" className="text-decoration-none">
                  <Button color="primary" size="lg" className="w-100">
                    <Home size={18} className="me-2" />
                    Go to Homepage
                  </Button>
                </Link>

                <Button
                  color="outline-secondary"
                  size="lg"
                  className="w-100"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-muted small">
              © {new Date().getFullYear()} NMDPRA
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
