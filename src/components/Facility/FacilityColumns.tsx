import { ColumnDef } from "@tanstack/react-table";
import { Facility } from "src/types/facility";
import { Badge } from "reactstrap";

export const facilityColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: "name",
    header: "Facility Name",
    cell: ({ row }) => (
      <div className="fw-semibold">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => <span>{row.original.company?.name || "N/A"}</span>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-truncate" style={{ maxWidth: "200px" }}>
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "state.name",
    header: "State",
    cell: ({ row }) => <span>{row.original.state?.name || "N/A"}</span>,
  },
  {
    accessorKey: "lga.name",
    header: "LGA",
    cell: ({ row }) => <span>{row.original.lga?.name || "N/A"}</span>,
  },
  {
    accessorKey: "installationType.name",
    header: "Installation Type",
    cell: ({ row }) => (
      <span>{row.original.installationType?.name || "N/A"}</span>
    ),
  },
  {
    accessorKey: "facilityType.name",
    header: "Facility Type",
    cell: ({ row }) => <span>{row.original.facilityType?.name || "N/A"}</span>,
  },
  {
    accessorKey: "omlNumber",
    header: "OML Number",
    cell: ({ row }) => <span>{row.getValue("omlNumber") || "—"}</span>,
  },
  {
    accessorKey: "field",
    header: "Field",
    cell: ({ row }) => <span>{row.getValue("field") || "—"}</span>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge color={row.getValue("isActive") ? "success" : "danger"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
];
