"use client";

import React from "react";
import { Row, Col, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { FormikProps } from "formik";
import { Sector } from "@/types/common";
import { Company } from "@/types/company";

interface CompanyFormProps {
  formikProps: FormikProps<Company>;
  sectors: Sector[];
}

const CompanyForm: React.FC<CompanyFormProps> = ({ formikProps, sectors }) => {
  const { errors, touched, values, handleChange, handleBlur } = formikProps;

  return (
    <Row>
      <Col md={6}>
        <FormGroup>
          <Label for="name">Company Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched.name && errors.name)}
            placeholder="Enter company name"
          />
          {touched.name && errors.name && (
            <FormFeedback>{errors.name}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup>
          <Label for="sectorId">Sector *</Label>
          <Input
            id="sectorId"
            name="sectorId"
            type="select"
            value={values.sectorId}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched.sectorId && errors.sectorId)}
          >
            <option value="">Select a sector</option>
            {sectors.map(sector => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </Input>
          {touched.sectorId && errors.sectorId && (
            <FormFeedback>{errors.sectorId}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      <Col md={12}>
        <FormGroup>
          <Label for="address">Address *</Label>
          <Input
            id="address"
            name="address"
            type="textarea"
            rows={3}
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched.address && errors.address)}
            placeholder="Enter company address"
          />
          {touched.address && errors.address && (
            <FormFeedback>{errors.address}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup>
          <Label for="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={values.contactEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched.contactEmail && errors.contactEmail)}
            placeholder="Enter contact email"
          />
          {touched.contactEmail && errors.contactEmail && (
            <FormFeedback>{errors.contactEmail}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      <Col md={6}>
        <FormGroup>
          <Label for="contactPhone">Contact Phone *</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={values.contactPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched.contactPhone && errors.contactPhone)}
            placeholder="Enter contact phone"
          />
          {touched.contactPhone && errors.contactPhone && (
            <FormFeedback>{errors.contactPhone}</FormFeedback>
          )}
        </FormGroup>
      </Col>
    </Row>
  );
};

export default CompanyForm;
