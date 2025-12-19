"use client";

import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import NameItemManagementTable from "src/components/Tables/NameItemManagmentTable";
import { IncidentType } from "src/types/common";
import BreadCrumb from "src/components/Common/BreadCrumb";
import {
  useCreateIncidentType,
  useGetIncidentTypes,
  useUpdateIncidentType,
  useDeleteIncidentType,
} from "src/hooks/incident-type.hook";

const IncidentTypesPage = () => {
  const {
    data: incidentTypes,
    isLoading,
    error,
    refetch,
  } = useGetIncidentTypes();
  const createIncidentMutation = useCreateIncidentType();
  const updateIncidentTypeMutation = useUpdateIncidentType();
  const deleteIncidentMutation = useDeleteIncidentType();

  // Handle add incident type
  const handleAddIncidentType = async (
    newIncidentType: Omit<IncidentType, "id">
  ) => {
    createIncidentMutation.mutate(newIncidentType, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle edit incident type
  const handleEditIncidentType = async (
    id: string,
    updatedData: Partial<IncidentType>
  ) => {
    const payload = {
      id,
      name: updatedData.name,
    };
    updateIncidentTypeMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle delete incident type
  const handleDeleteIncidentType = async (id: string) => {
    deleteIncidentMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Incident Types" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <NameItemManagementTable
                  data={incidentTypes}
                  isLoading={isLoading}
                  isError={!!error}
                  error={error}
                  onAdd={handleAddIncidentType}
                  onEdit={handleEditIncidentType}
                  onDelete={handleDeleteIncidentType}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={10}
                  title="Incident"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IncidentTypesPage;
