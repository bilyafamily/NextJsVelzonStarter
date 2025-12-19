"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import GenericManagementTable from "@/components/Tables/GenericManagementTable";

import {
  useGetCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/company.hook";
import CompanyForm from "@/components/Company/CompanyForm";
import { companychema } from "@/schemas/company.schema";
import { companyColumns } from "@/components/Company/CompanyColumns";
import { Company, CreateCompanyDto } from "src/types/company";
import { ResponseDto } from "src/types/common";
import { useGetSectors } from "src/hooks/sector.hook";

const initialCompanyValues = {
  name: "",
  address: "",
  sectorId: "",
  contactEmail: "",
  contactPhone: "",
  isActive: true,
};

const CompaniesPage = () => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const {
    data: companies = [],
    isLoading,
    error,
    isError,
    refetch,
  } = useGetCompanies();
  const { data: sectors = [] } = useGetSectors();

  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  const companyDropdownFilters = [
    {
      id: "sectorId",
      label: "Sector",
      options: sectors?.map(sector => ({
        label: sector.name,
        value: sector.id,
      })),
      placeholder: "All Sectors",
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

  // Handle add company
  const handleAddCompany = async (
    newCompany: CreateCompanyDto
  ): Promise<ResponseDto<Company>> => {
    return await createCompanyMutation.mutateAsync(newCompany);
  };

  // Handle edit company
  const handleEditCompany = async (
    id: string,
    updatedData: Partial<CreateCompanyDto>
  ): Promise<ResponseDto<Company>> => {
    return await updateCompanyMutation.mutateAsync({ id, ...updatedData });
  };

  // Handle delete company
  const handleDeleteCompany = async (id: string) => {
    await deleteCompanyMutation.mutateAsync(id);
  };

  // Render form inside modal
  const renderCompanyForm = (formikProps: any) => (
    <CompanyForm formikProps={formikProps} sectors={sectors} />
  );

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilterValues(filters);
    // You could also refetch data with these filters from the API here
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Companies" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <GenericManagementTable
                  data={companies}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  columns={companyColumns}
                  onAdd={handleAddCompany}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={100}
                  title="Company"
                  validationSchema={companychema}
                  initialValues={initialCompanyValues}
                  renderForm={renderCompanyForm}
                  dropdownFilters={companyDropdownFilters}
                  onFilterChange={handleFilterChange}
                  defaultFilterValues={filterValues}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CompaniesPage;
