"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Badge,
  Button,
  Table,
  Collapse,
  Alert,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import {
  useGetIncidentById,
  useUpdateIncidentStatus,
  useAssignIncidentToDesk,
} from "@/hooks/incident.hook";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

import { AssetDamage, IncidentInvoledPerson } from "src/types/incident";
import Image from "next/image";

type SectionKey =
  | "details"
  | "persons"
  | "witnesses"
  | "assets"
  | "attachments"
  | "activities";

// Workflow stages configuration
const WORKFLOW_STAGES = [
  {
    id: "incident_investigator",
    name: "Incident Investigator",
    description: "Initial investigation and evidence collection",
    nextStage: "head_hsec_field",
    previousStage: null,
  },
  {
    id: "head_hsec_field",
    name: "Head HSEC (Field Office)",
    description: "Field office review and validation",
    nextStage: "sc_rc_reviewer",
    previousStage: "incident_investigator",
  },
  {
    id: "sc_rc_reviewer",
    name: "SC/RC Reviewer (HQ)",
    description: "Headquarters review and compliance check",
    nextStage: "senior_manager_im",
    previousStage: "head_hsec_field",
  },
  {
    id: "senior_manager_im",
    name: "Senior Manager IM (HQ)",
    description: "Management review and decision",
    nextStage: "director_hs",
    previousStage: "sc_rc_reviewer",
  },
  {
    id: "director_hs",
    name: "Director H&S (HQ)",
    description: "Final approval and closure",
    nextStage: null,
    previousStage: "senior_manager_im",
  },
];

const IncidentDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"forward" | "return" | "close">(
    "forward"
  );
  const [comment, setComment] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    details: true,
    persons: false,
    witnesses: false,
    assets: false,
    attachments: false,
    activities: true,
  });

  // Fetch incident details
  const {
    data: incidentData,
    isLoading,
    error,
    refetch,
  } = useGetIncidentById(id as string);
  const updateStatusMutation = useUpdateIncidentStatus();
  const assignDeskMutation = useAssignIncidentToDesk();

  const incident = incidentData?.result;
  const incidentDetail = incident?.incidentDetail;
  const incidentConsequence = incident?.incidentConsequence;
  const assetDamages = incident?.assetDamages || [];
  const involvedPersons = incident?.involvedPersons || [];
  const witnesses = incident?.witnesses || [];
  const attachments = incident?.incidentAttachments || [];

  // Toggle section collapse
  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get current workflow stage
  const getCurrentStage = () => {
    return WORKFLOW_STAGES.find(
      stage => stage.id === incident?.currentDesk?.toLowerCase()
    );
  };

  // Get next stage
  const getNextStage = () => {
    const current = getCurrentStage();
    return current?.nextStage
      ? WORKFLOW_STAGES.find(stage => stage.id === current.nextStage)
      : null;
  };

  // Get previous stage
  const getPreviousStage = () => {
    const current = getCurrentStage();
    return current?.previousStage
      ? WORKFLOW_STAGES.find(stage => stage.id === current.previousStage)
      : null;
  };

  // Handle workflow action
  const handleWorkflowAction = async (type: "forward" | "return" | "close") => {
    if (type === "forward") {
      const nextStage = getNextStage();
      if (!nextStage) {
        toast.error("No next stage available");
        return;
      }

      await assignDeskMutation.mutateAsync({
        id: incident?.id as string,
        desk: nextStage.name,
      });

      toast.success(`Incident forwarded to ${nextStage.name}`);
    } else if (type === "return") {
      const prevStage = getPreviousStage();
      if (!prevStage) {
        toast.error("Cannot return further");
        return;
      }

      await assignDeskMutation.mutateAsync({
        id: incident?.id as string,
        desk: prevStage.name,
      });

      toast.success(`Incident returned to ${prevStage.name}`);
    } else if (type === "close") {
      await updateStatusMutation.mutateAsync({
        id: incident?.id as string,
        status: "Closed",
      });

      toast.success("Incident closed successfully");
    }

    setIsActionModalOpen(false);
    setComment("");
    refetch();
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "under investigation":
        return "warning";
      case "closed":
        return "success";
      case "escalated":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2">Loading incident details...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Alert color="danger">
                <h4 className="alert-heading">Error!</h4>
                <p>
                  Failed to load incident details. The incident may not exist or
                  you may not have permission to view it.
                </p>
                <hr />
                <div className="mb-0">
                  <Link href="/admin/incidents">
                    <Button color="danger" size="sm">
                      <i className="ri-arrow-left-line me-1"></i>
                      Back to Incidents
                    </Button>
                  </Link>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`Incident #${incident.id.substring(0, 8)}`}
          pageTitle="Incidents"
          parentLink="/admin/incidents"
        />

        {/* Header Section */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col lg={8}>
                    <div className="d-flex align-items-center mb-3">
                      <h3 className="mb-0 me-3">Incident Report</h3>
                      <Badge
                        color={getStatusColor(incident.status)}
                        className="fs-6 py-2"
                      >
                        {incident.status}
                      </Badge>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <div>
                        <span className="text-muted me-2">Reported:</span>
                        <strong>{formatDate(incident.createdAt)}</strong>
                      </div>
                      <div>
                        <span className="text-muted me-2">Incident Date:</span>
                        <strong>
                          {formatDate(incidentDetail?.incidentDate as string)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-muted me-2">Current Desk:</span>
                        <strong>{incident.currentDesk}</strong>
                      </div>
                    </div>
                  </Col>

                  <Col lg={4} className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <Link href="/admin/incidents">
                        <Button color="light" outline>
                          <i className="ri-arrow-left-line me-1"></i>
                          Back
                        </Button>
                      </Link>

                      {incident.status !== "Closed" && (
                        <>
                          <Button
                            color="primary"
                            onClick={() => {
                              setActionType("forward");
                              setIsActionModalOpen(true);
                            }}
                            disabled={!getNextStage()}
                            title={
                              !getNextStage() ? "No next stage available" : ""
                            }
                          >
                            <i className="ri-arrow-right-line me-1"></i>
                            Forward
                          </Button>

                          <Button
                            color="warning"
                            outline
                            onClick={() => {
                              setActionType("return");
                              setIsActionModalOpen(true);
                            }}
                            disabled={!getPreviousStage()}
                            title={
                              !getPreviousStage() ? "Cannot return further" : ""
                            }
                          >
                            <i className="ri-arrow-left-line me-1"></i>
                            Return
                          </Button>

                          <Button
                            color="success"
                            onClick={() => {
                              setActionType("close");
                              setIsActionModalOpen(true);
                            }}
                          >
                            <i className="ri-check-line me-1"></i>
                            Close
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Workflow Progress */}
        <Row className="mb-4">
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="mb-4">
                  <i className="ri-progress-3-line me-2"></i>
                  Investigation Workflow
                </CardTitle>

                <div className="workflow-progress">
                  {WORKFLOW_STAGES.map((stage, index) => {
                    const isCurrent =
                      stage.id === incident.currentDesk?.toLowerCase();
                    const isCompleted =
                      WORKFLOW_STAGES.findIndex(
                        s => s.id === incident.currentDesk?.toLowerCase()
                      ) > index;

                    return (
                      <div
                        key={stage.id}
                        className="workflow-step d-flex align-items-center mb-3"
                      >
                        <div
                          className={`step-icon rounded-circle d-flex align-items-center justify-content-center ${
                            isCurrent
                              ? "bg-primary text-white"
                              : isCompleted
                                ? "bg-success text-white"
                                : "bg-light text-muted"
                          }`}
                          style={{ width: "40px", height: "40px" }}
                        >
                          {index + 1}
                        </div>

                        <div className="step-content ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6
                                className={`mb-0 ${isCurrent ? "text-primary" : ""}`}
                              >
                                {stage.name}
                                {isCurrent && (
                                  <Badge color="primary" pill className="ms-2">
                                    Current
                                  </Badge>
                                )}
                              </h6>
                              <p className="text-muted mb-0 small">
                                {stage.description}
                              </p>
                            </div>

                            {isCompleted && (
                              <div className="text-success">
                                <i className="ri-check-double-line fs-5"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Incident Details */}
          <Col lg={8}>
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-file-text-line me-2"></i>
                    Incident Details
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("details")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.details ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.details}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Facility
                        </label>
                        <p className="fw-semibold">
                          {incidentDetail?.facility?.name || "N/A"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Accident Nature
                        </label>
                        <p className="fw-semibold">
                          {incidentDetail?.accidentNature || "N/A"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Incident Type
                        </label>
                        <p className="fw-semibold">
                          {incidentDetail?.incidentType?.name || "N/A"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Work Related
                        </label>
                        <Badge
                          color={
                            incidentDetail?.isWorkRelated === "Yes"
                              ? "success"
                              : "danger"
                          }
                        >
                          {incidentDetail?.isWorkRelated || "N/A"}
                        </Badge>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Asset Damage Description
                        </label>
                        <p className="fw-semibold">
                          {incidentConsequence?.assetDamageDescription ||
                            "No damage reported"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted">Created</label>
                        <p className="fw-semibold">
                          {formatDate(incidentDetail?.createdAt as string)}
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Last Updated
                        </label>
                        <p className="fw-semibold">
                          {formatDate(incidentDetail?.updatedAt as string) ||
                            "Never updated"}
                        </p>
                      </div>
                    </Col>

                    <Col md={12}>
                      <div className="mb-3">
                        <label className="form-label text-muted">
                          Description
                        </label>
                        <div className="bg-light p-3 rounded">
                          {incidentDetail?.description ||
                            "No description provided"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Collapse>
              </CardBody>
            </Card>

            {/* Involved Persons */}
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-user-line me-2"></i>
                    Involved Persons ({involvedPersons.length})
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("persons")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.persons ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.persons}>
                  {involvedPersons.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Employer</th>
                          <th>Injury Type</th>
                          <th>Hospitalized</th>
                          <th>Date of Demise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {involvedPersons.map(
                          (person: IncidentInvoledPerson) => (
                            <tr key={person.id}>
                              <td>{person.name}</td>
                              <td>{person.designation}</td>
                              <td>{person.employerName}</td>
                              <td>
                                <Badge color="info">
                                  {person.injuryType?.name || "N/A"}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  color={
                                    person.hospitalized === "Yes"
                                      ? "danger"
                                      : "success"
                                  }
                                >
                                  {person.hospitalized}
                                </Badge>
                              </td>
                              <td>
                                {person.dateOfDemise ? (
                                  <Badge color="danger">
                                    {formatDate(person.dateOfDemise)}
                                  </Badge>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert color="info">
                      No persons involved in this incident.
                    </Alert>
                  )}
                </Collapse>
              </CardBody>
            </Card>

            {/* Asset Damages */}
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-briefcase-line me-2"></i>
                    Asset Damages ({assetDamages.length})
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("assets")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.assets ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.assets}>
                  {assetDamages.length > 0 ? (
                    <ListGroup>
                      {assetDamages.map((asset: AssetDamage) => (
                        <ListGroupItem key={asset.id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{asset.assetName}</h6>
                              <small className="text-muted">
                                Type: {asset.assetType}
                              </small>
                              <p className="mt-2 mb-0">
                                {asset.damageDescription}
                              </p>
                            </div>
                          </div>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  ) : (
                    <Alert color="info">No asset damages reported.</Alert>
                  )}
                </Collapse>
              </CardBody>
            </Card>

            {/* Witnesses */}
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-eye-line me-2"></i>
                    Witnesses ({witnesses.length})
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("witnesses")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.witnesses ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.witnesses}>
                  {witnesses.length > 0 ? (
                    <Row>
                      {witnesses.map(witness => (
                        <Col md={6} key={witness.id} className="mb-3">
                          <Card className="border">
                            <CardBody>
                              <h6 className="mb-2">{witness.name}</h6>
                              <p className="mb-1">
                                <i className="ri-phone-line me-2"></i>
                                {witness.contactDetails}
                              </p>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert color="info">No witnesses reported.</Alert>
                  )}
                </Collapse>
              </CardBody>
            </Card>

            {/* Attachments */}
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-attachment-line me-2"></i>
                    Attachments ({attachments.length})
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("attachments")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.attachments ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.attachments}>
                  {attachments.length > 0 ? (
                    <Row>
                      {attachments.map(attachment => {
                        const isImage = attachment.fileUrl.match(
                          /\.(jpg|jpeg|png|gif|webp)$/i
                        );
                        const fileName = attachment.fileUrl.split("/").pop();

                        return (
                          <Col md={4} key={attachment.id} className="mb-3">
                            <Card className="border">
                              <CardBody className="text-center">
                                {isImage ? (
                                  <div className="mb-2">
                                    <Image
                                      src={attachment.fileUrl}
                                      alt={fileName as string}
                                      height={20}
                                      width={20}
                                      className="img-fluid rounded"
                                      style={{ maxHeight: "100px" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="mb-2">
                                    <i className="ri-file-line fs-1 text-muted"></i>
                                  </div>
                                )}
                                <small
                                  className="d-block text-truncate"
                                  title={fileName}
                                >
                                  {fileName}
                                </small>
                                <Button
                                  color="link"
                                  size="sm"
                                  href={attachment.fileUrl}
                                  target="_blank"
                                  className="mt-2"
                                >
                                  <i className="ri-download-line me-1"></i>
                                  Download
                                </Button>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  ) : (
                    <Alert color="info">No attachments uploaded.</Alert>
                  )}
                </Collapse>
              </CardBody>
            </Card>
          </Col>

          {/* Activity Timeline */}
          <Col lg={4}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="ri-history-line me-2"></i>
                    Activity Timeline
                  </CardTitle>
                  <Button
                    color="link"
                    onClick={() => toggleSection("activities")}
                    className="p-0"
                  >
                    <i
                      className={`ri-${expandedSections.activities ? "subtract" : "add"}-line`}
                    ></i>
                  </Button>
                </div>

                <Collapse isOpen={expandedSections.activities}>
                  <div className="activity-timeline">
                    {/* Sample activities - You would fetch these from your API */}
                    <div className="activity-item mb-4">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="avatar-xs">
                            <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                              <i className="ri-file-add-line"></i>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="fs-14 mb-1">Incident Created</h6>
                          <p className="text-muted mb-0">
                            Incident report was created and submitted
                          </p>
                          <small className="text-muted">
                            {formatDate(incident.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="activity-item mb-4">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="avatar-xs">
                            <div className="avatar-title bg-warning-subtle text-warning rounded-circle">
                              <i className="ri-user-search-line"></i>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="fs-14 mb-1">
                            Assigned to Investigator
                          </h6>
                          <p className="text-muted mb-0">
                            Case assigned to Incident Investigator for initial
                            review
                          </p>
                          <small className="text-muted">
                            {formatDate(incident.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="activity-item mb-4">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className="avatar-xs">
                            <div className="avatar-title bg-info-subtle text-info rounded-circle">
                              <i className="ri-shield-check-line"></i>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="fs-14 mb-1">Forwarded to Head HSEC</h6>
                          <p className="text-muted mb-0">
                            Investigation completed and forwarded for field
                            office review
                          </p>
                          <small className="text-muted">
                            {formatDate(
                              incident.updatedAt || incident.createdAt
                            )}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Add more activities based on your actual data */}
                  </div>

                  {/* Add Comment */}
                  <div className="mt-4">
                    <h6 className="fs-14 mb-3">Add Comment</h6>
                    <Form>
                      <FormGroup>
                        <Input
                          type={"textarea"}
                          rows={3}
                          placeholder="Add your comments or notes..."
                          className="form-control"
                        />
                      </FormGroup>
                      <Button color="primary" size="sm">
                        <i className="ri-send-plane-line me-1"></i>
                        Add Comment
                      </Button>
                    </Form>
                  </div>
                </Collapse>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Action Modal */}
        <Modal
          isOpen={isActionModalOpen}
          toggle={() => setIsActionModalOpen(!isActionModalOpen)}
        >
          <ModalHeader toggle={() => setIsActionModalOpen(!isActionModalOpen)}>
            {actionType === "forward" && "Forward Incident"}
            {actionType === "return" && "Return Incident"}
            {actionType === "close" && "Close Incident"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="comment">Comments</Label>
                <Input
                  type={"textarea"}
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e: any) => setComment(e.target.value)}
                  placeholder="Add any comments or notes regarding this action..."
                  className="form-control"
                />
              </FormGroup>

              <Alert color="info" className="mt-3">
                <i className="ri-information-line me-2"></i>
                {actionType === "forward" &&
                  `This will forward the incident to ${getNextStage()?.name}`}
                {actionType === "return" &&
                  `This will return the incident to ${getPreviousStage()?.name}`}
                {actionType === "close" &&
                  "This will close the incident. No further actions will be allowed."}
              </Alert>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setIsActionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color={
                actionType === "forward"
                  ? "primary"
                  : actionType === "return"
                    ? "warning"
                    : "success"
              }
              onClick={() => handleWorkflowAction(actionType)}
            >
              {actionType === "forward" && "Forward"}
              {actionType === "return" && "Return"}
              {actionType === "close" && "Close Incident"}
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default IncidentDetailPage;
