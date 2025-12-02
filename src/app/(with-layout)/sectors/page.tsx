import { Container, Row } from "reactstrap";
import BreadCrumb from "src/components/Common/BreadCrumb";
import SectorsList from "src/components/Pages/SectorList";

export default function TestSectors() {
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Sectors" pageTitle="Administration" />
        <Row>
          <SectorsList />
        </Row>
      </Container>
    </div>
  );
}
