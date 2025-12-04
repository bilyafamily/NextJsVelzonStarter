"use client";

import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Widget from "@components/DashboardEcommerce/Widgets";
import BestSellingProducts from "@components/DashboardEcommerce/BestSellingProducts";
import RecentOrders from "@components/DashboardEcommerce/RecentOrders";
import Revenue from "@components/DashboardEcommerce/Revenue";
import SalesByLocations from "@components/DashboardEcommerce/SalesByLocations";
import Section from "@components/DashboardEcommerce/Section";
import StoreVisits from "@components/DashboardEcommerce/StoreVisits";
import TopSellers from "@components/DashboardEcommerce/TopSellers";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  const { data: session } = useSession();

  console.log(session);

  return (
    <Row>
      <Col>
        <div className="h-100">
          <Section rightClickBtn={toggleRightColumn} />
          <Row>
            <Widget />
          </Row>
          <Row>
            <Col xl={8}>
              <Revenue />
            </Col>
            <SalesByLocations />
          </Row>
          <Row>
            <BestSellingProducts />
            <TopSellers />
          </Row>
          <Row>
            <StoreVisits />
            <RecentOrders />
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default Dashboard;
