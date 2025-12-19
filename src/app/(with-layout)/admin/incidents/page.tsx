"use client";

import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";
import GenericManagementTable, {
  DropdownFilter,
} from "@/components/Tables/GenericManagementTable";

import { QueryParams } from "@/types/common";
import { useGetIncidents, useDeleteIncident } from "@/hooks/incident.hook";
import Link from "next/link";
import { IncidentReportList } from "src/types/incident";
import { incidentColumns } from "src/components/Incident/IncidentReportColumns";

const IncidentsPage = () => {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Prepare query params with filters
  const queryParams: QueryParams = useMemo(() => {
    const params: QueryParams = {
      page: 1,
      limit: 100,
    };

    // Add filters to query params
    // Object.entries(filterValues).forEach(([key, value]) => {
    //   if (value) {
    //     params[key as keyof QueryParams] = value;
    //   }
    // });

    return params;
  }, [filterValues]);

  // Fetch incidents with filters
  const {
    data: incidentsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetIncidents(queryParams);

  const deleteIncidentMutation = useDeleteIncident();

  const incidents = incidentsData || [];

  // Extract unique values for dropdown filters
  const uniqueFacilities = Array.from(
    new Map(
      incidents
        .map(i => i.facility)
        .filter((facility): facility is string => !!facility)
        .map(facility => ({ label: facility, value: facility }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueCompanies = Array.from(
    new Map(
      incidents
        .map(i => i.company)
        .filter((company): company is string => !!company)
        .map(company => ({ label: company, value: company }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueIncidentTypes = Array.from(
    new Map(
      incidents
        .map(i => i.incidentType)
        .filter((type): type is string => !!type)
        .map(type => ({ label: type, value: type }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueInstallationTypes = Array.from(
    new Map(
      incidents
        .map(i => i.installationType)
        .filter((type): type is string => !!type)
        .map(type => ({ label: type, value: type }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueFacilityTypes = Array.from(
    new Map(
      incidents
        .map(i => i.facilityType)
        .filter((type): type is string => !!type)
        .map(type => ({ label: type, value: type }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueStatuses = Array.from(
    new Map(
      incidents
        .map(i => i.status)
        .filter((status): status is string => !!status)
        .map(status => ({ label: status, value: status }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueCurrentDesks = Array.from(
    new Map(
      incidents
        .map(i => i.currentDesk)
        .filter((desk): desk is string => !!desk)
        .map(desk => ({ label: desk, value: desk }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  const uniqueStates = Array.from(
    new Map(
      incidents
        .map(i => i.state)
        .filter((state): state is string => !!state)
        .map(state => ({ label: state, value: state }))
        .map(option => [option.value, option] as const)
    ).values()
  );

  // Prepare dropdown filters
  const incidentDropdownFilters: DropdownFilter[] = [
    {
      id: "facility",
      label: "Facility",
      options: uniqueFacilities,
      placeholder: "All Facilities",
    },
    {
      id: "company",
      label: "Company",
      options: uniqueCompanies,
      placeholder: "All Companies",
    },
    {
      id: "incidentType",
      label: "Incident Type",
      options: uniqueIncidentTypes,
      placeholder: "All Incident Types",
    },
    {
      id: "installationType",
      label: "Installation Type",
      options: uniqueInstallationTypes,
      placeholder: "All Installation Types",
    },
    {
      id: "facilityType",
      label: "Facility Type",
      options: uniqueFacilityTypes,
      placeholder: "All Facility Types",
    },
    {
      id: "status",
      label: "Status",
      options: uniqueStatuses,
      placeholder: "All Status",
    },
    {
      id: "currentDesk",
      label: "Current Desk",
      options: uniqueCurrentDesks,
      placeholder: "All Desks",
    },
    {
      id: "state",
      label: "State",
      options: uniqueStates,
      placeholder: "All States",
    },
  ];

  // Handle delete incident
  const handleDeleteIncident = async (id: string) => {
    await deleteIncidentMutation.mutateAsync(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilterValues(filters);
  };

  // Additional actions for each row - Only View Details button
  const additionalActions = (incident: IncidentReportList) => (
    <Link href={`/admin/incidents/${incident.incidentReportId}`} passHref>
      <Button color="success" size="sm" title="View Details">
        <i className="ri-eye-line me-1"></i>
        View
      </Button>
    </Link>
  );

  const customTopSection = (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 className="mb-0">Incident Reports</h5>
        <p className="text-muted mb-0">
          Manage all reported incidents in the system
        </p>
      </div>
      <div className="d-flex gap-2">
        <Button color="outline-primary" size="sm">
          <i className="ri-download-line me-2"></i>
          Export
        </Button>
        <Link href="/admin/incidents/report" passHref>
          <Button color="primary" size="sm">
            <i className="ri-add-line me-2"></i>
            Report Incident
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Incidents" pageTitle="Dashboard" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <GenericManagementTable
                  data={incidents}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  columns={incidentColumns}
                  onDelete={handleDeleteIncident}
                  refetch={refetch}
                  showSearch={true}
                  showPagination={true}
                  pageSize={100}
                  title="Incident"
                  dropdownFilters={incidentDropdownFilters}
                  onFilterChange={handleFilterChange}
                  defaultFilterValues={filterValues}
                  showAddButton={false}
                  showEditButton={false}
                  showDeleteButton={true}
                  additionalActions={additionalActions}
                  customTopSection={customTopSection}
                  emptyStateMessage="No incidents found. Report your first incident to get started."
                  enableRowSelection={true}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IncidentsPage;
