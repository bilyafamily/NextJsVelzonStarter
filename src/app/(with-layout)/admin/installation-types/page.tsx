"use client";

import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import NameItemManagementTable from "src/components/Tables/NameItemManagmentTable";
import { InstallationType } from "src/types/common";
import BreadCrumb from "src/components/Common/BreadCrumb";
import {
  useCreateInstallationType,
  useGetInstallationTypes,
  useUpdateInstallationType,
  useDeleteInstallationType,
} from "src/hooks/installation-type.hook";

const InstallationTypesPage = () => {
  const {
    data: installationTypes,
    isLoading,
    error,
    refetch,
  } = useGetInstallationTypes();
  const createInstallationMutation = useCreateInstallationType();
  const updateInstallationTypeMutation = useUpdateInstallationType();
  const deleteInstallationMutation = useDeleteInstallationType();

  // Handle add installation type
  const handleAddInstallationType = async (
    newInstallationType: Omit<InstallationType, "id">
  ) => {
    createInstallationMutation.mutate(newInstallationType, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle edit installation type
  const handleEditInstallationType = async (
    id: string,
    updatedData: Partial<InstallationType>
  ) => {
    const payload = {
      id,
      name: updatedData.name,
    };
    updateInstallationTypeMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle delete installation type
  const handleDeleteInstallationType = async (id: string) => {
    deleteInstallationMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Installation Types" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <NameItemManagementTable
                  data={installationTypes}
                  isLoading={isLoading}
                  isError={!!error}
                  error={error}
                  onAdd={handleAddInstallationType}
                  onEdit={handleEditInstallationType}
                  onDelete={handleDeleteInstallationType}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={10}
                  title="Installation"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InstallationTypesPage;
