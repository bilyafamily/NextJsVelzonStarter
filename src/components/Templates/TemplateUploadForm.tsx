import React from "react";
import { FormikProps } from "formik";
import {
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
  FormText,
} from "reactstrap";
import { CreateTemplateDto } from "@/types/template";

interface TemplateFormProps {
  formik: FormikProps<CreateTemplateDto>;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    setFieldValue("file", file);

    // Set fileType based on file extension
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      setFieldValue("fileType", extension);
      setFieldValue("name", file.name.split(".")[0]);
    }
  };

  const acceptedFileTypes = [
    ".doc",
    ".docx",
    ".pdf",
    ".xls",
    ".xlsx",
    ".png",
    ".ppt",
    ".pptx",
    ".txt",
  ].join(",");

  return (
    <Row>
      <Col lg={12}>
        <FormGroup>
          <Label for="name">Template Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(errors.name && touched.name)}
            placeholder="Enter template name"
          />
          {errors.name && touched.name && (
            <FormFeedback>{errors.name}</FormFeedback>
          )}
        </FormGroup>
      </Col>

      <Col lg={12}>
        <FormGroup>
          <Label for="file">Template File</Label>
          <Input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            onBlur={handleBlur}
            accept={acceptedFileTypes}
            invalid={!!(errors.file && touched.file)}
          />
          {errors.file && touched.file && (
            <FormFeedback>{errors.file as string}</FormFeedback>
          )}
          <FormText>
            Supported formats: DOC, DOCX, PDF, XLS, XLSX, PPT, PPTX, TXT
          </FormText>
        </FormGroup>
      </Col>

      <Col lg={12}>
        <FormGroup>
          <Label for="fileType">File Type</Label>
          <Input
            id="fileType"
            name="fileType"
            type="text"
            value={values.fileType}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
            className="bg-light"
            placeholder="Auto-detected from file"
          />
          <FormText>
            File type is automatically detected from the uploaded file
          </FormText>
        </FormGroup>
      </Col>

      <Col lg={12}>
        <FormGroup check>
          <Input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Label for="isActive" check>
            Set as active template
          </Label>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default TemplateForm;
