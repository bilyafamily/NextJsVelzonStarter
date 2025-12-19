"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import BreadCrumb from "src/components/Common/BreadCrumb";
import CreateIncidentForm from "@/components/Incident/CreateIncidentForm";
import { useGetFacilities } from "@/hooks/facility.hook";
import { useGetIncidentTypes } from "@/hooks/incident-type.hook";
import { useCreateIncident } from "@/hooks/incident.hook";
import { useGetInjuryTypes } from "@/hooks/injury-type.hook";
import {
  CreateIncident,
  IncidentInjuryType,
  IncidentType,
} from "src/types/incident";

function CreateIncidentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const incidentReportMutation = useCreateIncident();
  const router = useRouter();

  const {
    data: facilities,
    isLoading: isLoadingFacilities,
    error,
    isError,
    refetch,
  } = useGetFacilities();

  const { data: injuryTypes } = useGetInjuryTypes();

  const { data: incidentTypes } = useGetIncidentTypes();

  const handleSubmit = (data: CreateIncident) => {
    const formData = new FormData();

    formData.append("FacilityId", data.incidentDetail.facilityId);
    formData.append("AccidentNature", data.incidentDetail.accidentNature);
    formData.append("Description", data.incidentDetail.description);
    formData.append("IncidentTypeId", data.incidentDetail.incidentTypeId);
    formData.append("IsWorkRelated", data.incidentDetail.isWorkRelated);
    formData.append("IncidentDate", data.incidentDetail.incidentDate);

    formData.append(
      "AssetDamagesJson",
      JSON.stringify(data.incidentConsequence.assetDamages)
    );
    formData.append(
      "InvolvedPersonsJson",
      JSON.stringify(data.involvedPersons)
    );
    formData.append("WitnessesJson", JSON.stringify(data.witnesses));

    data.incidentAttachments.forEach(file => {
      formData.append("Attachments", file as File);
    });

    incidentReportMutation.mutate(formData, {
      onSuccess: response => {
        if (response.isSuccess) {
          router.push("/admin/incidents");
        }
      },
    });
  };

  if (!facilities || isLoadingFacilities || !injuryTypes || !incidentTypes) {
    return <Spinner />;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          pageTitle="Create Incident"
          title="Incident"
          parentLink="admin/incidents"
        />
        <Row>
          <Col lg={12}>
            <h1 className="mb-4">Create New Incident Report</h1>

            {submitStatus && (
              <Alert color={submitStatus.type} className="mb-4">
                {submitStatus.message}
              </Alert>
            )}

            <CreateIncidentForm
              onSubmit={handleSubmit}
              facilities={facilities}
              incidentTypes={incidentTypes}
              injuryTypes={injuryTypes}
              isLoading={incidentReportMutation.isPending}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateIncidentPage;
