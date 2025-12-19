"use client";

import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import NameItemManagementTable from "src/components/Tables/NameItemManagmentTable";
import { FacilityType } from "src/types/common";
import BreadCrumb from "src/components/Common/BreadCrumb";
import {
  useCreateFacilityType,
  useGetFacilityTypes,
  useUpdateFacilityType,
  useDeleteFacilityType,
} from "src/hooks/facility-type.hook";

const FacilityTypesPage = () => {
  const {
    data: facilityTypes,
    isLoading,
    error,
    refetch,
  } = useGetFacilityTypes();
  const createFacilityTypeMutation = useCreateFacilityType();
  const updateFacilityTypeMutation = useUpdateFacilityType();
  const deleteFacilityMutation = useDeleteFacilityType();

  // Handle add facility type
  const handleAddFacilityType = async (
    newFacilityType: Omit<FacilityType, "id">
  ) => {
    createFacilityTypeMutation.mutate(newFacilityType, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle edit facility type
  const handleEditFacilityType = async (
    id: string,
    updatedData: Partial<FacilityType>
  ) => {
    const payload = {
      id,
      name: updatedData.name,
    };
    updateFacilityTypeMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle delete facility type
  const handleDeleteFacilityType = async (id: string) => {
    deleteFacilityMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Facility Types" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <NameItemManagementTable
                  data={facilityTypes}
                  isLoading={isLoading}
                  isError={!!error}
                  error={error}
                  onAdd={handleAddFacilityType}
                  onEdit={handleEditFacilityType}
                  onDelete={handleDeleteFacilityType}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={10}
                  title="Facility"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FacilityTypesPage;
