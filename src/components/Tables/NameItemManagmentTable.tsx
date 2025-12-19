"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  InputGroup,
  InputGroupText,
  Badge,
  Spinner,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  FormFeedback,
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
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Activity,
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

export interface NameItem {
  id: string;
  name: string;
}

interface NameItemeManagementTableProps {
  data: NameItem[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onAdd?: (nameItem: Omit<NameItem, "id">) => Promise<void>;
  onEdit?: (id: string, nameItem: Partial<NameItem>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  refetch?: () => void;
  title: string;
}

const NameItemManagementTable: React.FC<NameItemeManagementTableProps> = ({
  data,
  isLoading = false,
  isError = false,
  error = null,
  onAdd,
  onEdit,
  onDelete,
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  refetch,
  title,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NameItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define table columns
  const columns = useMemo<ColumnDef<NameItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: `${title} Type Name`,
        cell: ({ row }) => {
          const nameItem = row.original;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div
                  className="avatar-sm rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
                  style={{ width: 40, height: 40 }}
                >
                  <Activity size={20} className="text-primary" />
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0">{nameItem.name}</h6>
                <small className="text-muted">
                  ID: {nameItem.id.substring(0, 8)}...
                </small>
              </div>
            </div>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const nameItem = row.original;
          return (
            <div className="d-flex gap-1">
              <Button
                color="primary"
                size="sm"
                onClick={() => handleEdit(nameItem)}
                className="d-flex align-items-center gap-1"
              >
                <Edit size={14} />
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDeleteClick(nameItem)}
                className="d-flex align-items-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

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
  };

  // Form handlers
  const handleAddClick = () => {
    setFormData({ name: "" });
    setFormErrors({ name: "" });
    setIsEditMode(false);
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (nameItem: NameItem) => {
    setSelectedItem(nameItem);
    setFormData({ name: nameItem.name });
    setFormErrors({ name: "" });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteClick = (nameItem: NameItem) => {
    setSelectedItem(nameItem);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem && onDelete) {
      try {
        await onDelete(selectedItem.id);
        setDeleteModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        console.error(`Failed to delete ${title} type:`, error);
      }
    }
  };

  const validateForm = () => {
    const errors = { name: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = `${title} type name is required`;
      isValid = false;
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && selectedItem && onEdit) {
        await onEdit(selectedItem.id, formData);
      } else if (!isEditMode && onAdd) {
        await onAdd(formData);
      }

      // Reset form and close modal
      setFormData({ name: "" });
      setModalOpen(false);
      setIsEditMode(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(`Failed to save ${title} type:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="table-container">
      {/* Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">{title} Types</h4>
          <p className="text-muted mb-0">
            Manage {title} types used in the system
          </p>
        </div>
        <Button
          color="success"
          onClick={handleAddClick}
          className="d-flex align-items-center gap-2"
          disabled={isLoading}
        >
          <Plus size={16} />
          Add {title} Type
        </Button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="mb-4">
          <div className="row">
            <div className="col-md-6">
              <InputGroup>
                <InputGroupText>
                  <Search size={16} />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Search ` types..."
                  value={globalFilter ?? ""}
                  onChange={e => handleSearch(e.target.value)}
                  disabled={isLoading}
                />
              </InputGroup>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-2">Loading {title} types...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert color="danger">
          <div className="d-flex align-items-start">
            <AlertTriangle size={20} className="me-3 flex-shrink-0 mt-1" />
            <div>
              <h5 className="alert-heading">Error Loading Data</h5>
              <p className="mb-2">
                {error?.message || `Failed to load ${title} types`}
              </p>
              {refetch && (
                <Button color="danger" size="sm" onClick={refetch}>
                  Retry
                </Button>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Data Table */}
      {!isLoading && !isError && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="mb-0">
                Showing {data.length} {title} type{data.length !== 1 ? "s" : ""}
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
                        <Activity size={48} className="mb-2" />
                        <h5>No ` types found</h5>
                        <p>
                          {globalFilter
                            ? "Try adjusting your search"
                            : `No ${title} types available. Add your first ${title} type.`}
                        </p>
                        {!globalFilter && (
                          <Button
                            color="primary"
                            onClick={handleAddClick}
                            className="mt-2"
                          >
                            <Plus size={16} className="me-2" />
                            Add {title} Type
                          </Button>
                        )}
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
                  {[5, 10, 20, 50, 100].map(pageSize => (
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

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered>
        <ModalHeader toggle={() => setModalOpen(false)}>
          <div className="d-flex align-items-center gap-2">
            {isEditMode ? <Edit size={20} /> : <Plus size={20} />}
            <span>
              {isEditMode ? `Edit ${title} Type` : `Add New ${title} Type`}
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name" className="fw-semibold">
                {title} Type Name <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="e.g., Fracture, Laceration, Burn"
                value={formData.name}
                onChange={handleInputChange}
                invalid={!!formErrors.name}
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <FormFeedback>{formErrors.name}</FormFeedback>
              )}
              <div className="form-text">
                Enter a descriptive name for the {title} type
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setModalOpen(false)}
            disabled={isSubmitting}
          >
            <X size={16} className="me-2" />
            Cancel
          </Button>
          <Button
            color={isEditMode ? "primary" : "success"}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className="d-flex align-items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                {isEditMode ? <Edit size={16} /> : <Plus size={16} />}
                {isEditMode ? "Update" : "Add"}
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setDeleteModalOpen(false)}>
          <div className="d-flex align-items-center gap-2 text-danger">
            <Trash2 size={20} />
            <span>Delete {title} Type</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <Alert color="danger" className="border-0">
            <div className="d-flex">
              <AlertTriangle size={20} className="me-3 flex-shrink-0 mt-1" />
              <div>
                <h5 className="alert-heading mb-2">Warning!</h5>
                <p className="mb-0">
                  Are you sure you want to delete the {title} type{" "}
                  <strong>"{selectedItem?.name}"</strong>?
                </p>
                <p className="mb-0 small mt-2">
                  This action cannot be undone. This {title} type may be in use
                  in existing records.
                </p>
              </div>
            </div>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>
            <X size={16} className="me-2" />
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleDeleteConfirm}
            className="d-flex align-items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NameItemManagementTable;
