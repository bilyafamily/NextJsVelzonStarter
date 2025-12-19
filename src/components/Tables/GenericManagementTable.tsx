"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  FormFeedback,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  FormGroup,
} from "reactstrap";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Formik, Form, Field, FormikProps } from "formik";
import * as yup from "yup";
import Link from "next/link";
import DeleteModal from "../Common/DeleteModal";
import { ResponseDto } from "src/types/common";

// Custom filter function for better searching
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export interface DropdownFilterOption {
  label: string;
  value: string;
}

export interface DropdownFilter {
  id: string;
  label: string;
  options: DropdownFilterOption[];
  defaultValue?: string;
  placeholder?: string;
}

export interface GenericTableProps<T extends { id: string }> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  columns: ColumnDef<T>[];
  onAdd?: (data: Omit<T, "id">) => Promise<ResponseDto<T>> | void;
  onEdit: (id: string, data: Partial<T>) => Promise<ResponseDto<T>> | void;
  onDelete: (id: string) => Promise<void> | void;
  refetch: () => void;
  showSearch?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  title: string;
  validationSchema?: yup.ObjectSchema<any>;
  initialValues?: any;
  renderForm?: (formikProps: FormikProps<any>) => React.ReactNode;
  dropdownFilters?: DropdownFilter[];
  onFilterChange?: (filters: Record<string, string>) => void;
  defaultFilterValues?: Record<string, string>;
  addButtonConfig?: {
    type: "modal" | "page";
    pageUrl?: string; // Required if type is 'page'
    buttonText?: string;
    buttonIcon?: string;
  };
  editButtonConfig?: {
    type: "modal" | "page";
    pageUrl?: (id: string) => string; // Function to generate edit page URL
  };
  showAddButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  additionalActions?: (row: T) => React.ReactNode;
  customTopSection?: React.ReactNode;
  emptyStateMessage?: string;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: T[]) => void;
}

const GenericManagementTable = <T extends { id: string }>({
  data,
  isLoading,
  isError,
  error,
  columns,
  onAdd,
  onEdit,
  onDelete,
  refetch,
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  title,
  validationSchema,
  initialValues,
  renderForm,
  dropdownFilters = [],
  onFilterChange,
  defaultFilterValues = {},
  addButtonConfig = {
    type: "modal",
    buttonText: `Add ${title}`,
    buttonIcon: "fas fa-plus",
  },
  editButtonConfig = {
    type: "modal",
  },
  showAddButton = true,
  showEditButton = true,
  showDeleteButton = true,
  additionalActions,
  customTopSection,
  emptyStateMessage,
  enableRowSelection = false,
  onRowSelectionChange,
}: GenericTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});

  // State for dropdown filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    () => {
      const initialFilters: Record<string, string> = {};
      dropdownFilters.forEach(filter => {
        initialFilters[filter.id] = defaultFilterValues[filter.id] || "";
      });
      return initialFilters;
    }
  );

  // State for dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>(
    () => {
      const initialOpen: Record<string, boolean> = {};
      dropdownFilters.forEach(filter => {
        initialOpen[filter.id] = false;
      });
      return initialOpen;
    }
  );

  // Filter data based on dropdown filters
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter(item => {
      return dropdownFilters.every(filter => {
        const filterValue = activeFilters[filter.id];

        // If no filter value selected, include all items
        if (!filterValue) return true;

        // Get the value from the item (support nested properties with dot notation)
        const getNestedValue = (obj: any, path: string) => {
          return path.split(".").reduce((acc, part) => acc && acc[part], obj);
        };

        const itemValue =
          getNestedValue(item, filter.id) || item[filter.id as keyof T];

        // Compare values
        return String(itemValue) === filterValue;
      });
    });
  }, [data, activeFilters, dropdownFilters]);

  // Handle row selection change
  useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = Object.keys(rowSelection)
        .filter(id => rowSelection[id as keyof typeof rowSelection])
        .map(id => filteredData.find(row => row.id === id))
        .filter(Boolean) as T[];
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, filteredData, enableRowSelection, onRowSelectionChange]);

  // Toggle dropdown
  const toggleDropdown = (id: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [filterId]: value,
    };

    setActiveFilters(newFilters);

    // Reset to first page when filter changes
    table.setPageIndex(0);

    // Call external filter change handler if provided
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: Record<string, string> = {};
    dropdownFilters.forEach(filter => {
      clearedFilters[filter.id] = "";
    });

    setActiveFilters(clearedFilters);
    setGlobalFilter("");
    setColumnFilters([]);
    setRowSelection({});

    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  // Get count of active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter(value => value !== "").length;
  }, [activeFilters]);

  // Get count of selected rows
  const selectedRowCount = useMemo(() => {
    return Object.values(rowSelection).filter(Boolean).length;
  }, [rowSelection]);

  // Build table columns
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // Add selection column if enabled
    if (enableRowSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <div className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              title="Select all rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              title="Select row"
            />
          </div>
        ),
        size: 50,
      });
    }

    // Add data columns
    cols.push(...columns);

    // Add actions column
    cols.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          {showEditButton && editButtonConfig.type === "modal" && (
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                setEditingItem(row.original);
                setIsModalOpen(true);
              }}
              title={`Edit ${title}`}
            >
              <i className="ri-pencil-line"></i>
            </Button>
          )}
          {showEditButton &&
            editButtonConfig.type === "page" &&
            editButtonConfig.pageUrl && (
              <Link href={editButtonConfig.pageUrl(row.original.id)} passHref>
                <Button color="primary" size="sm" title={`Edit ${title}`}>
                  <i className="ri-pencil-line"></i>
                </Button>
              </Link>
            )}
          {showDeleteButton && (
            <Button
              color="danger"
              size="sm"
              onClick={() => {
                setItemToDelete(row.original.id);
                setDeleteModalOpen(true);
              }}
              title={`Delete ${title}`}
            >
              <i className="ri-delete-bin-line"></i>
            </Button>
          )}
          {additionalActions && additionalActions(row.original)}
        </div>
      ),
      size: 150,
    });

    return cols;
  }, [
    columns,
    title,
    showEditButton,
    showDeleteButton,
    additionalActions,
    editButtonConfig,
    enableRowSelection,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection: enableRowSelection ? rowSelection : {},
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    enableRowSelection: enableRowSelection,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (editingItem && onEdit) {
        await onEdit(editingItem.id, values);
      } else if (onAdd) {
        await onAdd(values);
      }
      resetForm();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete && onDelete) {
      await onDelete(itemToDelete);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading {title}s...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Error: {error?.message || "Failed to load data"}
        <Button
          color="link"
          size="sm"
          onClick={() => refetch()}
          className="ms-2"
        >
          Try again
        </Button>
      </div>
    );
  }

  const showModalAdd =
    showAddButton && addButtonConfig.type === "modal" && onAdd;
  const showPageAdd =
    showAddButton && addButtonConfig.type === "page" && addButtonConfig.pageUrl;

  return (
    <div className="generic-table-container">
      {/* Custom Top Section */}
      {customTopSection && <div className="mb-3">{customTopSection}</div>}
      {/* Selection Actions */}
      {enableRowSelection && selectedRowCount > 0 && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
          <div>
            <i className="fas fa-check-circle me-2"></i>
            <strong>{selectedRowCount}</strong> {title.toLowerCase()}(s)
            selected
          </div>
          <div>
            <Button
              color="light"
              size="sm"
              onClick={() => setRowSelection({})}
              className="me-2"
            >
              Clear Selection
            </Button>
            <Button color="info" size="sm">
              Bulk Actions
            </Button>
          </div>
        </div>
      )}
      {/* Filters Section */}
      {(showSearch || dropdownFilters.length > 0) && (
        <div className="filters-section mb-3 p-3 border rounded bg-light">
          <Row className="align-items-center">
            {/* Global Search */}
            {showSearch && (
              <Col md={dropdownFilters.length > 0 ? 3 : 12}>
                <FormGroup>
                  <Label for="global-search" className="fw-medium">
                    Search
                  </Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="ri-search-line"></i>
                    </span>
                    <Input
                      id="global-search"
                      type="search"
                      placeholder={`Search ${title.toLowerCase()}s...`}
                      value={globalFilter ?? ""}
                      onChange={e => {
                        setGlobalFilter(e.target.value);
                        table.setPageIndex(0);
                      }}
                    />
                  </div>
                </FormGroup>
              </Col>
            )}

            {/* Dropdown Filters */}
            {dropdownFilters.length > 0 && (
              <>
                {dropdownFilters.map(filter => (
                  <Col md={3} key={filter.id}>
                    <FormGroup>
                      <Label for={`filter-${filter.id}`} className="fw-medium">
                        {filter.label}
                      </Label>
                      <Input
                        id={`filter-${filter.id}`}
                        type="select"
                        value={activeFilters[filter.id] || ""}
                        onChange={e =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                      >
                        <option value="">
                          {filter.placeholder ||
                            `All ${filter.label.toLowerCase()}s`}
                        </option>
                        {filter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                ))}
              </>
            )}
          </Row>

          {/* Filter Status & Clear Button */}
          {activeFilterCount > 0 && (
            <Row className="mt-2">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge color="info" className="me-2">
                      <i className="ri-filter-line me-1"></i>
                      Active filters: {activeFilterCount}
                    </Badge>
                    {dropdownFilters.map(filter => {
                      const value = activeFilters[filter.id];
                      if (!value) return null;

                      const option = filter.options.find(
                        opt => opt.value === value
                      );
                      return (
                        <Badge
                          key={filter.id}
                          color="secondary"
                          className="me-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleFilterChange(filter.id, "")}
                        >
                          {filter.label}: {option?.label}{" "}
                          <i className="fas fa-times ms-1"></i>
                        </Badge>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    color="link"
                    onClick={clearAllFilters}
                    className="text-decoration-none"
                  >
                    <i className="ri-filter-off-line me-1"></i>
                    Clear all filters
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      )}
      {/* Table Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">{title} Management</h4>
          {filteredData.length > 0 && (
            <p className="text-muted mb-0">
              Showing {filteredData.length} {title.toLowerCase()}(s)
            </p>
          )}
        </div>
        <div className="d-flex gap-2">
          {/* Refresh Button */}
          <Button color="primary" onClick={refetch} title="Refresh">
            <i className="ri-refresh-line"></i>
          </Button>

          {/* Add Button - Modal or Page Link */}
          {showModalAdd && (
            <Button color="success" onClick={() => setIsModalOpen(true)}>
              <i className={`${addButtonConfig.buttonIcon} me-2`}></i>
              {addButtonConfig.buttonText}
            </Button>
          )}

          {showPageAdd && (
            <Link href={addButtonConfig.pageUrl!} passHref>
              <Button color="success" tag="a">
                <i className={`${addButtonConfig.buttonIcon} me-2`}></i>
                {addButtonConfig.buttonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="table-light">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}px`
                        : "auto",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="d-flex align-items-center"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ms-1">
                            {{
                              asc: (
                                <i className="fas fa-sort-up text-primary"></i>
                              ),
                              desc: (
                                <i className="fas fa-sort-down text-primary"></i>
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <i className="fas fa-sort text-muted"></i>
                            )}
                          </span>
                        )}
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
                  colSpan={columns.length + (enableRowSelection ? 2 : 1)}
                  className="text-center py-5"
                >
                  <div className="text-muted">
                    <i className="fas fa-inbox fa-3x mb-3 opacity-50"></i>
                    <h5 className="mb-2">
                      {emptyStateMessage || `No ${title.toLowerCase()}s found`}
                    </h5>
                    {activeFilterCount > 0 ? (
                      <p>
                        Try adjusting your filters or{" "}
                        <Button
                          color="link"
                          size="sm"
                          onClick={clearAllFilters}
                          className="p-0"
                        >
                          clear all filters
                        </Button>
                      </p>
                    ) : (
                      showAddButton && (
                        <p>
                          Get started by creating your first{" "}
                          {title.toLowerCase()}
                        </p>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={
                    enableRowSelection && row.getIsSelected()
                      ? "table-active"
                      : ""
                  }
                >
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
          <div>
            Showing {table.getRowModel().rows.length} of {filteredData.length}{" "}
            entries
            {filteredData.length !== data.length && (
              <span className="text-muted ms-2">
                (filtered from {data.length} total)
              </span>
            )}
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              outline
            >
              <i className="fas fa-chevron-left me-1"></i> Previous
            </Button>
            <div className="d-flex gap-1 align-items-center">
              {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                .filter(page => {
                  const currentPage = table.getState().pagination.pageIndex + 1;
                  return (
                    Math.abs(page - currentPage) <= 2 ||
                    page === 1 ||
                    page === table.getPageCount()
                  );
                })
                .map((pageNumber, index, array) => {
                  // Add ellipsis for skipped pages
                  const showEllipsis =
                    index > 0 && array[index - 1] !== pageNumber - 1;
                  return (
                    <React.Fragment key={pageNumber}>
                      {showEllipsis && <span className="mx-1">...</span>}
                      <Button
                        size="sm"
                        color={
                          table.getState().pagination.pageIndex + 1 ===
                          pageNumber
                            ? "primary"
                            : "light"
                        }
                        onClick={() => table.setPageIndex(pageNumber - 1)}
                      >
                        {pageNumber}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              outline
            >
              Next <i className="fas fa-chevron-right ms-1"></i>
            </Button>
          </div>
        </div>
      )}
      {/* Add/Edit Modal - Only show if modal-based add/edit is configured */}
      {showModalAdd && (
        <Modal isOpen={isModalOpen} toggle={handleModalClose} size="lg">
          <Formik
            initialValues={editingItem || initialValues || {}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {formikProps => (
              <Form>
                <ModalHeader toggle={handleModalClose}>
                  <i className="fas fa-pencil-alt me-2"></i>
                  {editingItem ? `Edit ${title}` : `Add New ${title}`}
                </ModalHeader>
                <ModalBody>
                  {renderForm ? (
                    renderForm(formikProps)
                  ) : (
                    <div className="alert alert-warning">
                      No form renderer provided for {title}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={formikProps.isSubmitting}
                  >
                    {formikProps.isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : editingItem ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModalOpen}
        onCloseClick={() => setDeleteModalOpen(false)}
        onDeleteClick={handleDelete}
      />
    </div>
  );
};

export default GenericManagementTable;
