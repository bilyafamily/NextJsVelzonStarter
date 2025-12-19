import { ColumnDef } from "@tanstack/react-table";
import { Template } from "@/types/template";
import StatusBadge from "../Common/StatusBadge";

export const templateColumns: ColumnDef<Template>[] = [
  {
    accessorKey: "name",
    header: "Template Name",
    cell: ({ row }) => {
      return (
        <div>
          <span className="fw-medium">{row.original.name}</span>
          <div className="text-muted small">{row.original.fileType}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "fileType",
    header: "File Type",
    cell: ({ row }) => {
      const fileType = row.original.fileType;
      return (
        <span className="badge bg-primary bg-opacity-10 text-primary">
          {fileType.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
  },
  {
    accessorKey: "createdDate",
    header: "Upload Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StatusBadge
          status={row.original.isActive}
          showIcon={true}
          size="sm"
          variant="light"
        />
      );
    },
  },
];
