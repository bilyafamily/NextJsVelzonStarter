"use client";
import { NextPage } from "next";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useMemo, useState } from "react";

import BreadCrumb from "src/components/Common/BreadCrumb";
import GenericManagementTable from "src/components/Tables/GenericManagementTable";
import { templateColumns } from "src/components/Templates/TemplateColumns";
import { templateSchema } from "src/schemas/template.schema";
import { ResponseDto } from "src/types/common";
import {
  CreateTemplateDto,
  GetTemplatesParams,
  Template,
} from "src/types/template";
import {
  useCreateTemplate,
  useDeleteTemplate,
  useGetTemplates,
  useToggleTemplateStatus,
  useUpdateTemplate,
} from "src/hooks/template.hook";
import TemplateForm from "@/components/Templates/TemplateUploadForm";
import Link from "next/link";
import ConfirmationModal from "src/components/Common/ConfirmationModal";

const initialTemplateValues: CreateTemplateDto = {
  name: "",
  fileType: "",
  file: null,
  isActive: true,
};

const TemplatesPage: NextPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Template | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const createTemplateMutation = useCreateTemplate();
  const toggleStatusMutation = useToggleTemplateStatus();

  // Prepare query params with filters
  const queryParams: GetTemplatesParams = useMemo(() => {
    const params: GetTemplatesParams = {
      page: 1,
      limit: 100,
    };

    // Add filters to query params
    // Object.entries(filterValues).forEach(([key, value]) => {
    //   if (value) {
    //     params[key as keyof GetTemplatesParams] = value;
    //   }
    // });

    return params;
  }, [filterValues]);

  // Fetch templates with filters
  const {
    data: templatesData,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetTemplates(queryParams);

  const templates = templatesData || [];

  // Prepare unique values for dropdown filters
  const uniqueFileTypes = Array.from(
    new Map(
      templates
        .map((t: any) => t.fileType)
        .filter((fileType: any): fileType is string => !!fileType)
        .map((fileType: any) => ({
          label: fileType.toUpperCase(),
          value: fileType,
        }))
        .map((option: any) => [option.value, option] as const)
    ).values()
  );

  const uniqueUploadedBy = Array.from(
    new Map(
      templates
        .map((t: Template) => t.uploadedBy)
        .filter((uploadedBy: any): uploadedBy is string => !!uploadedBy)
        .map((uploadedBy: string) => ({
          label: uploadedBy,
          value: uploadedBy,
        }))
        .map((option: any) => [option.value, option] as const)
    ).values()
  );

  // Prepare dropdown filters
  const templateDropdownFilters = [
    {
      id: "fileType",
      label: "File Type",
      options: uniqueFileTypes,
      placeholder: "All File Types",
    },
    {
      id: "uploadedBy",
      label: "Uploaded By",
      options: uniqueUploadedBy,
      placeholder: "All Users",
    },
    {
      id: "isActive",
      label: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      placeholder: "All Status",
    },
  ];

  // Handle add template
  const handleAddTemplate = async (
    newTemplate: CreateTemplateDto
  ): Promise<ResponseDto<Template>> => {
    return await createTemplateMutation.mutateAsync(newTemplate);
  };

  // Handle edit template
  const handleEditTemplate = async (
    id: string,
    updatedData: Partial<CreateTemplateDto>
  ): Promise<ResponseDto<Template>> => {
    return await updateTemplateMutation.mutateAsync({ id, ...updatedData });
  };

  // Handle delete template
  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplateMutation.mutateAsync(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const renderTemplateForm = (formikProps: any) => {
    return <TemplateForm formik={formikProps} />;
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilterValues(filters);
    // The query will automatically refetch because queryParams changes
  };

  const handleToggle = () => {
    toggleStatusMutation.mutate(
      { id: selectedItem?.id as string },
      {
        onSuccess: () => {
          setOpenModal(false);
          refetch();
        },
      }
    );
  };

  const additionalActions = (template: Template) => (
    <div className="d-flex gap-2">
      <Link href={template.fileUrl} target="_blank" passHref>
        <Button color="primary" size="sm" title="Download Template">
          <i className="ri-download-line"></i>
        </Button>
      </Link>
      <Link href={`/templates/${template.id}/preview`} passHref>
        <Button color="info" size="sm" title="Preview Template">
          <i className="ri-eye-line"></i>
        </Button>
      </Link>
      <Button
        color="warning"
        size="sm"
        title="Toggle Status"
        onClick={() => {
          setSelectedItem(template);
          setOpenModal(!openModal);
        }}
      >
        <i className="ri-file-lock-line"></i>
      </Button>
    </div>
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Templates" pageTitle="Documents" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <GenericManagementTable
                  data={templates}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  columns={templateColumns}
                  onAdd={handleAddTemplate}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={100}
                  title="Template"
                  validationSchema={templateSchema}
                  initialValues={initialTemplateValues}
                  renderForm={renderTemplateForm}
                  dropdownFilters={templateDropdownFilters}
                  onFilterChange={handleFilterChange}
                  defaultFilterValues={filterValues}
                  addButtonConfig={{
                    type: "modal",
                    buttonText: "Upload Template",
                    buttonIcon: "ri-upload-line",
                  }}
                  editButtonConfig={{
                    type: "modal",
                  }}
                  showAddButton={true}
                  showEditButton={true}
                  showDeleteButton={true}
                  onRowSelectionChange={selection => {
                    console.log(selection);
                  }}
                  // additionalActions={additionalActions}
                  // customTopSection={customTopSection}
                  emptyStateMessage="No templates found. Upload your first template to get started."
                  enableRowSelection={true}
                  additionalActions={additionalActions}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ConfirmationModal
          onCloseClick={() => setOpenModal(!openModal)}
          show={openModal}
          onConfirmClick={handleToggle}
        />
      </Container>
    </div>
  );
};

export default TemplatesPage;
