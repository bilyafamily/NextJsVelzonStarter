"use client";

import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import GenericManagementTable, {
  DropdownFilter,
} from "@/components/Tables/GenericManagementTable";
import { facilityColumns } from "@/components/Facility/FacilityColumns";

import {
  CreateFacilityDto,
  Facility,
  GetFacilitiesParams,
} from "@/types/facility";
import { ResponseDto } from "@/types/common";

import { facilitySchema } from "@/schemas/facility.schema";
import {
  useCreateFacility,
  useDeleteFacility,
  useGetFacilities,
} from "@/hooks/facility.hook";
import { useUpdateFacilityType } from "@/hooks/facility-type.hook";
import FacilityForm from "src/components/Facility/FacilityForm";
import Link from "next/link";

const initialFacilityValues: CreateFacilityDto = {
  name: "",
  address: "",
  longitude: 0,
  latitude: 0,
  omlNumber: "",
  field: "",
  installationTypeId: "",
  facilityTypeId: "",
  companyId: "",
  stateId: "",
  lgaId: "",
};

const FacilitiesPage = () => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  // Prepare query params with filters
  const queryParams: GetFacilitiesParams = useMemo(() => {
    const params: GetFacilitiesParams = {
      page: 1,
      limit: 100,
    };

    // Add filters to query params
    // Object.entries(filterValues).forEach(([key, value]) => {
    //   if (value) {
    //     params[key as keyof GetFacilitiesParams] = value;
    //   }
    // });

    return params;
  }, [filterValues]);

  // Fetch facilities with filters
  const {
    data: facilitiesData,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetFacilities(queryParams);

  const deleteFacilityMutation = useDeleteFacility();

  const facilities = facilitiesData || [];

  const uniqueStates = Array.from(
    new Map(
      facilities
        .map(f => f.state)
        .filter(
          (state): state is any =>
            state !== null &&
            state !== undefined &&
            typeof state.id === "string" &&
            typeof state.name === "string"
        )
        .map(state => ({
          label: state.name,
          value: state.id,
        }))
        .map(option => [option.value, option] as const) // key by value for dedupe
    ).values()
  );
  const uniqueInstallationTypes = Array.from(
    new Map(
      facilities
        .map(f => f.installationType)
        .filter(
          (t): t is { id: string; name: string } =>
            !!t && typeof t.id === "string" && typeof t.name === "string"
        )
        .map(t => ({ label: t.name, value: t.id }))
        .map(o => [o.value, o] as const)
    ).values()
  );

  const uniqueFacilityTypes = Array.from(
    new Map(
      facilities
        .map(f => f.facilityType)
        .filter(
          (t): t is { id: string; name: string } =>
            !!t && typeof t.id === "string" && typeof t.name === "string"
        )
        .map(t => ({ label: t.name, value: t.id }))
        .map(o => [o.value, o] as const)
    ).values()
  );

  // Keep companies as-is if you still have a separate list, or extract similarly
  // If you want to extract companies from facilities too:
  // Prepare dropdown filters
  const facilityDropdownFilters: DropdownFilter[] = [
    {
      id: "stateId",
      label: "State",
      options: uniqueStates,
      placeholder: "All States",
    },
    {
      id: "installationTypeId",
      label: "Installation Type",
      options: uniqueInstallationTypes,
      placeholder: "All Installation Types",
    },
    {
      id: "facilityTypeId",
      label: "Facility Type",
      options: uniqueFacilityTypes,
      placeholder: "All Facility Types",
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

  const createFacilityMutation = useCreateFacility();
  const updateFacilityMutation = useUpdateFacilityType();

  // Handle add facility
  const handleAddFacility = async (
    newFacility: CreateFacilityDto
  ): Promise<ResponseDto<Facility>> => {
    return await createFacilityMutation.mutateAsync(newFacility);
  };

  // Handle edit facility
  const handleEditFacility = async (
    id: string,
    updatedData: Partial<CreateFacilityDto>
  ): Promise<ResponseDto<Facility>> => {
    return await updateFacilityMutation.mutateAsync({ id, ...updatedData });
  };

  // Handle delete facility
  const handleDeleteFacility = async (id: string) => {
    await deleteFacilityMutation.mutateAsync(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Render form inside modal
  const renderFacilityForm = (formikProps: any) => {
    return <FacilityForm formik={formikProps} />;
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilterValues(filters);
    // The query will automatically refetch because queryParams changes
  };

  // Additional actions for each row
  const additionalActions = (facility: Facility) => (
    <Link href={`/facilities/${facility.id}/details`} passHref>
      <Button color="info" size="sm" title="View Details">
        <i className="ri-eye-line"></i>
      </Button>
    </Link>
  );

  // const customTopSection = (
  //   <div className="d-flex justify-content-between align-items-center mb-3">
  //     <div>
  //       <h5 className="mb-0">Facility Management</h5>
  //       <p className="text-muted mb-0">Manage all facilities in the system</p>
  //     </div>
  //     <div className="d-flex gap-2">
  //       <Button color="outline-secondary" size="sm">
  //         <i className="ri-download-line me-2"></i>
  //         Export
  //       </Button>
  //       <Button color="outline-secondary" size="sm">
  //         <i className="ri-upload-line me-2"></i>
  //         Import
  //       </Button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Facilities" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <GenericManagementTable
                  data={facilities}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  columns={facilityColumns}
                  onAdd={handleAddFacility}
                  onEdit={handleEditFacility}
                  onDelete={handleDeleteFacility}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={100}
                  title="Facility"
                  validationSchema={facilitySchema}
                  initialValues={initialFacilityValues}
                  renderForm={renderFacilityForm}
                  dropdownFilters={facilityDropdownFilters}
                  onFilterChange={handleFilterChange}
                  defaultFilterValues={filterValues}
                  addButtonConfig={{
                    type: "page",
                    pageUrl: "/admin/facilities/create",
                    buttonText: "Add Facility",
                    buttonIcon: "ri-add-circle-line",
                  }}
                  editButtonConfig={{
                    type: "page",
                    pageUrl: (id: string) => `/admin/facilities/edit/${id}`,
                  }}
                  showAddButton={true}
                  showEditButton={true}
                  showDeleteButton={true}
                  additionalActions={additionalActions}
                  // customTopSection={customTopSection}
                  emptyStateMessage="No facilities found. Add your first facility to get started."
                  enableRowSelection={true}
                  onRowSelectionChange={selectedRows => {
                    // console.log("Selected facilities:", selectedRows);
                    // You can implement bulk actions here
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FacilitiesPage;
