import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "reactstrap";
import { Company } from "src/types/company";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="fw-semibold">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "sector.name",
    header: "Sector",
    cell: ({ row }) => <span>{row.original.sector?.name || "N/A"}</span>,
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
  },
  {
    accessorKey: "contactPhone",
    header: "Phone",
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
