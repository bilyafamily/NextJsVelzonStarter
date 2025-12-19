import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/Common/StatusBadge";
import { Badge } from "reactstrap";
import { IncidentReportList } from "src/types/incident";

export const incidentColumns: ColumnDef<IncidentReportList>[] = [
  {
    accessorKey: "facility",
    header: "Facility",
    cell: ({ row }) => {
      return (
        <div>
          <span className="fw-medium">{row.original.facility}</span>
          <div className="text-muted small">{row.original.company}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "incidentType",
    header: "Incident Type",
    cell: ({ row }) => {
      const incidentType = row.original.incidentType;
      const getColor = () => {
        switch (incidentType.toLowerCase()) {
          case "fire/explosion":
            return "danger";
          case "spill":
            return "warning";
          case "leak":
            return "info";
          case "safety violation":
            return "secondary";
          default:
            return "primary";
        }
      };
      return (
        <Badge color={getColor()} pill className="fw-medium">
          {incidentType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "incidentDate",
    header: "Incident Date",
    cell: ({ row }) => {
      const date = new Date(row.original.incidentDate);
      return (
        <div>
          <span className="fw-medium">{date.toLocaleDateString()}</span>
          <div className="text-muted small">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusConfig = () => {
        switch (status.toLowerCase()) {
          case "under investigation":
            return { color: "warning", text: "Investigating" };
          case "resolved":
            return { color: "success", text: "Resolved" };
          case "pending review":
            return { color: "info", text: "Pending Review" };
          case "escalated":
            return { color: "danger", text: "Escalated" };
          default:
            return { color: "secondary", text: status };
        }
      };
      const config = getStatusConfig();
      return (
        <Badge
          color={config.color}
          pill
          className={`bg-${config.color}-subtle text-${config.color}-emphasis`}
        >
          {config.text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "currentDesk",
    header: "Current Desk",
    cell: ({ row }) => {
      const desk = row.original.currentDesk;
      return (
        <div className="d-flex align-items-center">
          <i className="ri-user-line me-2 text-muted"></i>
          <span>{desk}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      return (
        <div>
          <span className="d-block">{row.original.state}</span>
          <div className="text-muted small">
            {row.original.installationType} • {row.original.facilityType}
          </div>
        </div>
      );
    },
  },
];
