"use client";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "@common/BreadCrumb";
import { useGetSectors } from "src/hooks/sector.hook";

const Starter = () => {
  const { data, isLoading, error, isError, refetch } = useGetSectors();

  if (isLoading || !data) return <div>Loading...</div>;

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // console.log("Sectors data:", data);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Starter" pageTitle="Pages" />
          <Row>
            <Col xs={12}>{JSON.stringify(data)}</Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Starter;
