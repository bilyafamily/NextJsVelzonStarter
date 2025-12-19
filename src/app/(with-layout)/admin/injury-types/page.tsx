"use client";

import React from "react";
import { Container, Row, Col, Card, CardBody, Spinner } from "reactstrap";
import NameItemManagementTable from "src/components/Tables/NameItemManagmentTable";
import { InjuryType } from "src/types/common";
import BreadCrumb from "src/components/Common/BreadCrumb";
import {
  useCreateInjuryType,
  useGetInjuryTypes,
  useUpdateInjuryType,
  useDeleteInjuryType,
} from "src/hooks/injury-type.hook";
import ErrorPage from "src/components/Common/ErrorPage";

const InjuryTypesPage = () => {
  const {
    data: injuryTypes,
    isLoading,
    error,
    refetch,
    isError,
  } = useGetInjuryTypes();
  const createInjuryMutation = useCreateInjuryType();
  const updateInjuryTypeMutation = useUpdateInjuryType();
  const deleteInjuryMutation = useDeleteInjuryType();

  // Handle add injury type
  const handleAddInjuryType = async (newInjuryType: Omit<InjuryType, "id">) => {
    createInjuryMutation.mutate(newInjuryType, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle edit injury type
  const handleEditInjuryType = async (
    id: string,
    updatedData: Partial<InjuryType>
  ) => {
    const payload = {
      id,
      name: updatedData.name,
    };
    updateInjuryTypeMutation.mutate(payload, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle delete injury type
  const handleDeleteInjuryType = async (id: string) => {
    deleteInjuryMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading || !injuryTypes) {
    return <Spinner />;
  }

  if (isError) {
    return <ErrorPage error={error} isLoading={isLoading} refresh={refetch} />;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Injury Types" pageTitle="Administration" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <NameItemManagementTable
                  data={injuryTypes}
                  isLoading={isLoading}
                  isError={!!error}
                  error={error}
                  onAdd={handleAddInjuryType}
                  onEdit={handleEditInjuryType}
                  onDelete={handleDeleteInjuryType}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={10}
                  title="Injury"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InjuryTypesPage;
