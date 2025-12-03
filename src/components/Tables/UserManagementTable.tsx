"use client";

import React, { useState } from "react";
import {
  Table,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
  Spinner,
  Alert,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  User,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";

interface UserManagementTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onSearch?: (searchTerm: string) => void;
  onFilterChange?: (filter: string) => void;
  onRemoveUser?: (userId: string, userName: string, group: string) => void;
  groupOptions?: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  selectedGroup?: string;
  onGroupChange?: (group: string) => void;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  refetch?: () => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  data,
  columns,
  isLoading = false,
  isError = false,
  error = null,
  onSearch,
  groupOptions = [],
  selectedGroup = "all",
  onGroupChange,
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  refetch,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
  };

  const handleGroupChange = (group: string) => {
    if (onGroupChange) onGroupChange(group);
  };

  // Default group options if not provided
  const defaultGroupOptions = [
    { value: "all", label: "All Groups", color: "secondary" },
    { value: "administrator", label: "Administrators", color: "danger" },
    { value: "coordinator", label: "Coordinators", color: "primary" },
    { value: "senior manager", label: "Senior Managers", color: "info" },
    { value: "investigator", label: "Investigators", color: "warning" },
    { value: "reviewer", label: "Reviewers", color: "success" },
  ];

  const effectiveGroupOptions =
    groupOptions.length > 0 ? groupOptions : defaultGroupOptions;

  return (
    <div className="table-container">
      {/* Search and Filter Bar */}
      {showSearch && (
        <div className="mb-4">
          <div className="row g-2">
            <div className="col-md-6">
              <InputGroup>
                <InputGroupText>
                  <Search size={16} />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={globalFilter ?? ""}
                  onChange={e => handleSearch(e.target.value)}
                  disabled={isLoading}
                />
              </InputGroup>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2">
                {effectiveGroupOptions.length > 0 && (
                  <UncontrolledDropdown className="flex-grow-1">
                    <DropdownToggle
                      color="light"
                      caret
                      className="w-100 d-flex justify-content-between align-items-center"
                    >
                      <Filter size={16} className="me-2" />
                      {selectedGroup === "all"
                        ? "All Groups"
                        : effectiveGroupOptions.find(
                            g => g.value === selectedGroup
                          )?.label}
                    </DropdownToggle>
                    <DropdownMenu className="w-100">
                      {effectiveGroupOptions.map(group => (
                        <DropdownItem
                          key={group.value}
                          onClick={() => handleGroupChange(group.value)}
                          active={selectedGroup === group.value}
                        >
                          <Badge
                            color={group.color as any}
                            className="me-2"
                            pill
                          >
                            {group.label.split(" ")[0].charAt(0)}
                          </Badge>
                          {group.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
                <Button
                  color="light"
                  onClick={() => {
                    handleSearch("");
                    if (onGroupChange) onGroupChange("all");
                  }}
                  title="Clear Filters"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-2">Loading data...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert color="danger">
          <h5>Error Loading Data</h5>
          <p className="mb-2">{error?.message || "Failed to load data"}</p>
          {refetch && (
            <Button color="danger" size="sm" onClick={refetch}>
              Retry
            </Button>
          )}
        </Alert>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-0">
                Showing {data.length} item{data.length !== 1 ? "s" : ""}
              </h6>
            </div>
            <div className="text-muted small">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className="text-center py-4"
                    >
                      <div className="text-muted">
                        <User size={48} className="mb-2" />
                        <h5>No data found</h5>
                        <p>
                          {globalFilter || selectedGroup !== "all"
                            ? "Try adjusting your search or filters"
                            : "No data available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {showPagination && table.getPageCount() > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {table.getRowModel().rows.length} of {data.length} items
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  color="light"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft size={16} />
                </Button>

                <Pagination className="mb-0">
                  {Array.from(
                    { length: Math.min(5, table.getPageCount()) },
                    (_, i) => {
                      const pageIndex =
                        Math.max(
                          0,
                          Math.min(
                            table.getPageCount() - 5,
                            table.getState().pagination.pageIndex - 2
                          )
                        ) + i;
                      if (pageIndex >= table.getPageCount()) return null;
                      return (
                        <PaginationItem
                          key={pageIndex}
                          active={
                            table.getState().pagination.pageIndex === pageIndex
                          }
                        >
                          <PaginationLink
                            className="mt-3 "
                            onClick={() => table.setPageIndex(pageIndex)}
                          >
                            {pageIndex + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}
                </Pagination>

                <Button
                  color="light"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight size={16} />
                </Button>
                <Button
                  color="light"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Go to page:</span>
                <Input
                  type="number"
                  min={1}
                  max={table.getPageCount()}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="form-control form-control-sm"
                  style={{ width: "70px" }}
                />
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                >
                  {[2, 20, 30, 40, 100].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementTable;
