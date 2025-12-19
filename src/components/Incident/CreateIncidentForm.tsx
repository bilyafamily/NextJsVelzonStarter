"use client";

import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  Badge,
  FormFeedback,
} from "reactstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  CreateIncident,
  IncidentType,
  IncidentInjuryType,
} from "@/types/incident";
import { Facility } from "@/types/facility";

interface CreateIncidentFormProps {
  onSubmit: (values: CreateIncident) => void;
  facilities: Facility[];
  incidentTypes: IncidentType[];
  injuryTypes: IncidentInjuryType[];
  isLoading?: boolean;
}

const CreateIncidentForm: React.FC<CreateIncidentFormProps> = ({
  onSubmit,
  facilities,
  incidentTypes,
  injuryTypes,
  isLoading = false,
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [witnesses, setWitnesses] = useState<
    { name: string; contactDetails: string }[]
  >([{ name: "", contactDetails: "" }]);
  const [involvedPersons, setInvolvedPersons] = useState<
    {
      name: string;
      designation: string;
      employerName: string;
      hospitalized: string;
      hospitalName: string;
      injuryTypeId: string;
      dateOfDemise: string;
    }[]
  >([
    {
      name: "",
      designation: "",
      employerName: "",
      hospitalized: "",
      hospitalName: "",
      injuryTypeId: "",
      dateOfDemise: "",
    },
  ]);
  const [assetDamages, setAssetDamages] = useState<
    { assetName: string; assetType: string; damageDescription: string }[]
  >([{ assetName: "", assetType: "", damageDescription: "" }]);

  // Validation Schema
  const validationSchema = yup.object({
    incidentDetail: yup.object({
      facilityId: yup.string().required("Facility is required"),
      accidentNature: yup.string().required("Accident nature is required"),
      description: yup
        .string()
        .required("Description is required")
        .min(20, "Description must be at least 20 characters"),
      incidentTypeId: yup.string().required("Incident type is required"),
      isWorkRelated: yup.string().required(),
      incidentDate: yup.string().required("Incident date is required"),
    }),
    incidentConsequence: yup.object({
      assetDamageDescription: yup
        .string()
        .required("Asset damage description is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      incidentDetail: {
        facilityId: "",
        accidentNature: "",
        description: "",
        incidentTypeId: "",
        isWorkRelated: "",
        incidentDate: new Date().toISOString().split("T")[0],
      },
      incidentConsequence: {
        assetDamageDescription: "",
        assetDamages: [] as any[],
      },
      involvedPersons: [] as any[],
      witnesses: [] as any[],
      incidentAttachments: [] as any[],
    },
    validationSchema,
    onSubmit: values => {
      const formData: CreateIncident = {
        ...values,
        involvedPersons: involvedPersons.map(person => ({
          ...person,
          injuryType: injuryTypes.filter(it => it.id === person.injuryTypeId),
        })),
        witnesses: witnesses.map(witness => ({
          ...witness,
        })),
        incidentConsequence: {
          ...values.incidentConsequence,
          assetDamages: assetDamages.map(damage => ({
            ...damage,
          })),
        },
        incidentAttachments: attachments,
      };

      onSubmit(formData);
    },
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files);
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Witness handlers
  const addWitness = () => {
    setWitnesses(prev => [...prev, { name: "", contactDetails: "" }]);
  };

  const removeWitness = (index: number) => {
    if (witnesses.length > 1) {
      setWitnesses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateWitness = (
    index: number,
    field: "name" | "contactDetails",
    value: string
  ) => {
    setWitnesses(prev =>
      prev.map((witness, i) =>
        i === index ? { ...witness, [field]: value } : witness
      )
    );
  };

  // Involved persons handlers
  const addInvolvedPerson = () => {
    setInvolvedPersons(prev => [
      ...prev,
      {
        name: "",
        designation: "",
        employerName: "",
        hospitalized: "",
        hospitalName: "",
        injuryTypeId: "",
        dateOfDemise: "",
      },
    ]);
  };

  const removeInvolvedPerson = (index: number) => {
    if (involvedPersons.length > 1) {
      setInvolvedPersons(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateInvolvedPerson = (index: number, field: string, value: any) => {
    setInvolvedPersons(prev =>
      prev.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      )
    );
  };

  // Asset damage handlers
  const addAssetDamage = () => {
    setAssetDamages(prev => [
      ...prev,
      { assetName: "", assetType: "", damageDescription: "" },
    ]);
  };

  const removeAssetDamage = (index: number) => {
    if (assetDamages.length > 1) {
      setAssetDamages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateAssetDamage = (index: number, field: string, value: string) => {
    setAssetDamages(prev =>
      prev.map((damage, i) =>
        i === index ? { ...damage, [field]: value } : damage
      )
    );
  };

  return (
    <Card className="shadow">
      <CardHeader className="">
        <CardTitle tag="h3" className="mb-0">
          <i className="ri-triangle-line mr-2"></i>
          Create New Incident Report
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={formik.handleSubmit}>
          {/* Incident Details Section */}
          <Card className="mb-4">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Incident Details</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="facilityId">Facility *</Label>
                    <Input
                      type="select"
                      className="form-select"
                      id="facilityId"
                      name="incidentDetail.facilityId"
                      value={formik.values.incidentDetail.facilityId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.incidentDetail?.facilityId &&
                        !!formik.errors.incidentDetail?.facilityId
                      }
                    >
                      <option value="">Select Facility</option>
                      {facilities.map(facility => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>
                      {formik.errors.incidentDetail?.facilityId}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="incidentTypeId">Incident Type *</Label>
                    <Input
                      id="incidentTypeId"
                      type="select"
                      name="incidentDetail.incidentTypeId"
                      className="form-select"
                      value={formik.values.incidentDetail.incidentTypeId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.incidentDetail?.incidentTypeId &&
                        !!formik.errors.incidentDetail?.incidentTypeId
                      }
                    >
                      <option value="">Select Incident Type</option>
                      {incidentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>
                      {formik.errors.incidentDetail?.incidentTypeId}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="incidentDate">Incident Date *</Label>
                    <Input
                      type="date"
                      id="incidentDate"
                      name="incidentDetail.incidentDate"
                      value={formik.values.incidentDetail.incidentDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      invalid={
                        formik.touched.incidentDetail?.incidentDate &&
                        !!formik.errors.incidentDetail?.incidentDate
                      }
                    />
                    <FormFeedback>
                      {formik.errors.incidentDetail?.incidentDate}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="work-related">Is Work Related</Label>
                    <Input
                      type="select"
                      id="isWorkRelated"
                      name="incidentDetail.isWorkRelated"
                      invalid={
                        formik.touched.incidentDetail?.isWorkRelated &&
                        !!formik.errors.incidentDetail?.isWorkRelated
                      }
                      onChange={formik.handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="accidentNature">Accident Nature *</Label>
                    <Input
                      type="text"
                      id="accidentNature"
                      name="incidentDetail.accidentNature"
                      placeholder="Brief description of what happened"
                      value={formik.values.incidentDetail.accidentNature}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.incidentDetail?.accidentNature &&
                        !!formik.errors.incidentDetail?.accidentNature
                      }
                    />
                    <FormFeedback>
                      {formik.errors.incidentDetail?.accidentNature}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="description">Detailed Description *</Label>
                <Input
                  id="description"
                  type={"textarea"}
                  name="incidentDetail.description"
                  placeholder="Provide detailed description of the incident..."
                  rows={5}
                  value={formik.values.incidentDetail.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.incidentDetail?.description &&
                    !!formik.errors.incidentDetail?.description
                  }
                />
                <FormFeedback>
                  {formik.errors.incidentDetail?.description}
                </FormFeedback>
              </FormGroup>
            </CardBody>
          </Card>

          {/* Involved Persons Section */}
          <Card className="mb-4">
            <CardHeader className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Involved Persons</h5>
              <Button color="success" size="sm" onClick={addInvolvedPerson}>
                <i className="ri-add-circle-line mr-1"></i> Add Person
              </Button>
            </CardHeader>
            <CardBody>
              {involvedPersons.map((person, index) => (
                <div key={index} className="border p-3 mb-3 rounded">
                  <Row>
                    <Col md={11}>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`person-name-${index}`}>Name</Label>
                            <Input
                              type="text"
                              id={`person-name-${index}`}
                              placeholder="Full Name"
                              value={person.name}
                              //   invalid={
                              //     formik.touched.involvedPersons?. &&
                              //     !!formik.errors.incidentDetail?.description
                              //   }
                              onChange={e =>
                                updateInvolvedPerson(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`person-designation-${index}`}>
                              Designation
                            </Label>
                            <Input
                              type="text"
                              id={`person-designation-${index}`}
                              placeholder="Job Title/Role"
                              value={person.designation}
                              onChange={e =>
                                updateInvolvedPerson(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`person-injuryType-${index}`}>
                              Injury Type
                            </Label>
                            <Input
                              type="select"
                              className="form-select"
                              id={`person-injuryType-${index}`}
                              value={person.injuryTypeId}
                              onChange={e =>
                                updateInvolvedPerson(
                                  index,
                                  "injuryTypeId",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Injury Type</option>
                              {injuryTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`person-employer-${index}`}>
                              Employer
                            </Label>
                            <Input
                              type="text"
                              id={`person-employer-${index}`}
                              placeholder="Employer name"
                              value={person.employerName}
                              onChange={e =>
                                updateInvolvedPerson(
                                  index,
                                  "employerName",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`person-dateOfDemise-${index}`}>
                              Date of Demise
                            </Label>
                            <Input
                              type="date"
                              className="form-control"
                              id={`person-dateOfDemise-${index}`}
                              placeholder="Date of Demise"
                              value={person.dateOfDemise}
                              onChange={e =>
                                updateInvolvedPerson(
                                  index,
                                  "dateOfDemise",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label>Is Person Hospitalized</Label>
                            <Input
                              type="select"
                              className="form-select"
                              id={`person-hospitalized-${index}`}
                              //   label="Hospitalized"
                              //   checked={person.hospitalized}
                              onChange={(e: any) =>
                                updateInvolvedPerson(
                                  index,
                                  "hospitalized",
                                  e.target.value
                                )
                              }
                            >
                              <option value={""}>
                                Select Hospitalization Status
                              </option>
                              <option value={"No"}>No</option>
                              <option value={"Yes"}>Yes</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        {person.hospitalized === "Yes" && (
                          <Col md={4}>
                            <FormGroup>
                              <Label for={`person-hospital-${index}`}>
                                Hospital Name
                              </Label>
                              <Input
                                type="text"
                                id={`person-hospital-${index}`}
                                placeholder="Hospital Name"
                                value={person.hospitalName}
                                onChange={e =>
                                  updateInvolvedPerson(
                                    index,
                                    "hospitalName",
                                    e.target.value
                                  )
                                }
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    </Col>
                    <Col
                      md={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {involvedPersons.length > 1 && (
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => removeInvolvedPerson(index)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Witnesses Section */}
          <Card className="mb-4">
            <CardHeader className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Witnesses</h5>
              <Button color="success" size="sm" onClick={addWitness}>
                <i className="ri-add-circle-line mr-1"></i> Add Witness
              </Button>
            </CardHeader>
            <CardBody>
              {witnesses.map((witness, index) => (
                <Row key={index} className="mb-3">
                  <Col md={5}>
                    <Input
                      type="text"
                      placeholder="Witness Name"
                      value={witness.name}
                      onChange={e =>
                        updateWitness(index, "name", e.target.value)
                      }
                    />
                  </Col>
                  <Col md={5}>
                    <Input
                      type="text"
                      placeholder="Contact Details (Phone/Email)"
                      value={witness.contactDetails}
                      onChange={e =>
                        updateWitness(index, "contactDetails", e.target.value)
                      }
                    />
                  </Col>
                  <Col md={2}>
                    {witnesses.length > 1 && (
                      <Button
                        color="danger"
                        size="sm"
                        block
                        onClick={() => removeWitness(index)}
                      >
                        <i className="ri-delete-bin-line"></i> Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </CardBody>
          </Card>

          {/* Asset Damage Section */}
          <Card className="mb-4">
            <CardHeader className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Asset Damages</h5>
              <Button color="success" size="sm" onClick={addAssetDamage}>
                <i className="ri-add-circle-line mr-1"></i> Add Damage
              </Button>
            </CardHeader>
            <CardBody>
              {assetDamages.map((damage, index) => (
                <div key={index} className="border p-3 mb-3 rounded">
                  <Row>
                    <Col md={11}>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`damage-assetName-${index}`}>
                              Asset Name
                            </Label>
                            <Input
                              type="text"
                              id={`damage-assetName-${index}`}
                              placeholder="e.g., Crane, Vehicle, Equipment"
                              value={damage.assetName}
                              onChange={e =>
                                updateAssetDamage(
                                  index,
                                  "assetName",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`damage-assetType-${index}`}>
                              Asset Type
                            </Label>
                            <Input
                              type="text"
                              id={`damage-assetType-${index}`}
                              placeholder="e.g., Heavy Machinery, Vehicle"
                              value={damage.assetType}
                              onChange={e =>
                                updateAssetDamage(
                                  index,
                                  "assetType",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label for={`damage-description-${index}`}>
                              Damage Description
                            </Label>
                            <Input
                              type="text"
                              id={`damage-description-${index}`}
                              placeholder="Describe the damage"
                              value={damage.damageDescription}
                              onChange={e =>
                                updateAssetDamage(
                                  index,
                                  "damageDescription",
                                  e.target.value
                                )
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      md={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {assetDamages.length > 1 && (
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => removeAssetDamage(index)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
              <FormGroup>
                <Label for="assetDamageDescription">
                  Overall Damage Description *
                </Label>
                <Input
                  type="textarea"
                  id="assetDamageDescription"
                  name="incidentConsequence.assetDamageDescription"
                  placeholder="Describe the overall damage to assets..."
                  rows={3}
                  value={
                    formik.values.incidentConsequence.assetDamageDescription
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.incidentConsequence
                      ?.assetDamageDescription &&
                    !!formik.errors.incidentConsequence?.assetDamageDescription
                  }
                />
                <FormFeedback>
                  {formik.errors.incidentConsequence?.assetDamageDescription}
                </FormFeedback>
              </FormGroup>
            </CardBody>
          </Card>

          {/* Attachments Section */}
          <Card className="mb-4">
            <CardHeader className="bg-light">
              <h5 className="mb-0">Attachments</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="attachments">Upload Supporting Documents</Label>
                <Input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <small className="form-text text-muted">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                </small>
              </FormGroup>

              {attachments.length > 0 && (
                <div className="mt-3">
                  <h6>Uploaded Files:</h6>
                  <ul className="list-group">
                    {attachments.map((file, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          <i className="ri-file-pdf-2-line mr-2"></i>
                          {file.name}
                          <Badge color="info" className="ml-2">
                            {(file.size / 1024).toFixed(2)} KB
                          </Badge>
                        </span>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <i className="ri-delete-bin-line text-white"></i>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Form Actions */}
          <Row className="d-flex flex-row gap-4 mt-4">
            <Col md={6} className="d-flex flex-row gap-4">
              <Button
                type="submit"
                color="success"
                size="lg"
                // disabled={isLoading || formik.isSubmitting}
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-line mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line mr-2"></i>
                    Submit Incident Report
                  </>
                )}
              </Button>
              <Button
                type="button"
                color="secondary"
                size="lg"
                className="ml-2"
                onClick={() => formik.resetForm()}
                disabled={isLoading}
              >
                <i className="ri-arrow-go-back-line mr-2"></i>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CreateIncidentForm;
