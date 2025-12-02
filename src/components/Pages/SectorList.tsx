"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
//redux
import TableContainer from "@common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import DeleteModal from "@common/DeleteModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useCreateSector,
  useDeleteMultipleSectors,
  useDeleteSector,
  useGetSectors,
  useUpdateSector,
} from "@/hooks/sector.hook";
import { SectorInterface, UpdateSectorDto } from "@/types/sector";
import Loader from "../Common/Loader";
import ErrorIndicator from "../Common/ErrorIndicator";

const SectorsList = () => {
  // Get sectors using React Query hook
  const { data: sectorsList, isLoading, error, refetch } = useGetSectors();
  const createSectorMutation = useCreateSector();
  const updateSectorMutation = useUpdateSector();
  const deleteSectorMutation = useDeleteSector();
  const deleteMultipleSectorsMutation = useDeleteMultipleSectors();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sector, setSector] = useState<SectorInterface | null>(null);

  //   const [sectorData, setSectorData] = useState<SectorInterface[]>([]);

  // Delete Sectors
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setSector(null);
    } else {
      setModal(true);
      setSector(null);
    }
  }, [modal]);

  // validation
  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (sector && sector.id) || "",
      name: (sector && sector.name) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Please Enter Sector Name")
        .min(2, "Sector name must be at least 2 characters")
        .max(100, "Sector name cannot exceed 100 characters"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isEdit && sector) {
          const payload: UpdateSectorDto = {
            name: values.name,
            id: sector.id,
          };
          await updateSectorMutation
            .mutateAsync(payload)
            .then(() => {
              toast.success("Sector updated successfully");
              refetch();
            })
            .catch(error => {
              toast.error(error.message ?? "Failed to create sector");
            });
        } else {
          // Create new sector
          await createSectorMutation
            .mutateAsync({
              name: values.name,
            })
            .then(() => {
              toast.success("Sector created successfully");
              refetch();
            })
            .catch(error => {
              toast.error(error.message ?? "Failed to create sector");
            });
        }

        resetForm();
        toggle();
      } catch (error) {
        // Error is handled by the mutation hook
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Delete Data
  const onClickDelete = (sector: SectorInterface) => {
    setSector(sector);
    setDeleteModal(true);
  };

  const handleDeleteSector = async () => {
    if (sector) {
      await deleteSectorMutation
        .mutateAsync(sector.id)
        .then(() => {
          setDeleteModal(false);
          toast.success("Sector deleted successfully");
          refetch();
        })
        .catch(error => {
          toast.error("Failed to delete sector");
        });
    }
  };

  // Update Data
  const handleSectorClick = (sector: SectorInterface) => {
    setSector(sector);
    setIsEdit(true);
    setModal(true);
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall: any = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".sectorCheckBox");

    if (checkall.checked) {
      ele.forEach((ele: any) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele: any) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any>([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] =
    useState<boolean>(false);

  const deleteMultiple = async () => {
    const ids = selectedCheckBoxDelete.map((checkbox: any) => checkbox.value);
    await deleteMultipleSectorsMutation
      .mutateAsync(ids)
      .then(() => {
        setDeleteModalMulti(false);
        toast.success("Selected sectors deleted successfully");
        refetch();
        const checkall: any = document.getElementById("checkBoxAll");
        if (checkall) checkall.checked = false;
        setIsMultiDeleteButton(false);
      })
      .catch(error => {
        toast.error("Failed to delete selected sectors");
      });
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".sectorCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        cell: (cell: any) => {
          return (
            <input
              type="checkbox"
              className="sectorCheckBox form-check-input"
              value={cell.getValue()}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
      },

      {
        header: "Sector Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return (
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">{cell.getValue()}</div>
            </div>
          );
        },
      },
      {
        header: "Created Date",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return cell.getValue() ? (
            <span>{new Date(cell.getValue()).toLocaleDateString()}</span>
          ) : (
            <span className="text-muted">N/A</span>
          );
        },
      },
      {
        header: "Actions",
        cell: (cell: any) => {
          const sectorData = cell.row.original;
          const isActive = sectorData.isActive;

          const handleEdit = async () => {
            setIsEditing(true);
            try {
              await handleSectorClick(sectorData);
            } finally {
              setIsEditing(false);
            }
          };

          const handleDelete = async () => {
            setIsDeleting(true);
            try {
              await onClickDelete(sectorData);
            } finally {
              setIsDeleting(false);
            }
          };

          return (
            <div className="d-flex gap-1">
              {/* Edit Button */}
              <button
                type="button"
                className="btn btn-sm btn-icon btn-soft-primary"
                onClick={() => handleSectorClick(sectorData)}
                title="Edit Sector"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </button>

              {/* Toggle Active/Inactive Button */}
              <button
                type="button"
                className={`btn btn-sm btn-icon ${isActive ? "btn-soft-warning" : "btn-soft-success"}`}
                // onClick={() => handleToggleStatus(sectorData)}
                title={isActive ? "Deactivate" : "Activate"}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i
                  className={`ri-${isActive ? "pause" : "play"}-fill fs-16`}
                ></i>
              </button>

              {/* View Details Button */}
              <button
                type="button"
                className="btn btn-sm btn-icon btn-soft-info"
                // onClick={() => handleViewDetails(sectorData)}
                title="View Details"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i className="ri-eye-fill fs-16"></i>
              </button>

              {/* Delete Button */}
              <button
                type="button"
                className="btn btn-sm btn-icon btn-soft-danger"
                onClick={() => onClickDelete(sectorData)}
                title="Delete"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <i className="ri-delete-bin-fill fs-16"></i>
              </button>
            </div>
          );
        },
      },
    ],
    [checkedAll]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorIndicator error={error} refetch={() => refetch()} />;
  }

  return (
    <React.Fragment>
      <Row>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteSector}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Col lg={12}>
          <Card>
            <CardHeader className="border-0">
              <div className="d-flex align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">Sectors</h5>
                <div className="flex-shrink-0">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-success add-btn"
                      onClick={() => {
                        setIsEdit(false);
                        toggle();
                      }}
                    >
                      <i className="ri-add-line align-bottom"></i> Add Sector
                    </button>{" "}
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-soft-danger"
                        onClick={() => setDeleteModalMulti(true)}
                      >
                        <i className="ri-delete-bin-2-line"></i> Delete Selected
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {sectorsList && sectorsList.length > 0 ? (
                <TableContainer
                  columns={columns}
                  data={sectorsList || []}
                  isGlobalFilter={true}
                  customPageSize={10}
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  SearchPlaceholder="Search for sector..."
                />
              ) : (
                <div className="text-center py-4">
                  <i className="ri-folder-line display-4 text-muted"></i>
                  <h5 className="mt-3">No Sectors Found</h5>
                  <p className="text-muted mb-4">
                    Get started by creating a new sector
                  </p>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setIsEdit(false);
                      toggle();
                    }}
                  >
                    <i className="ri-add-line align-bottom me-1"></i> Add First
                    Sector
                  </button>
                </div>
              )}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        className="border-0"
        modalClassName="zoomIn"
      >
        <ModalHeader toggle={toggle} className="p-3 bg-info-subtle">
          {!!isEdit ? "Edit Sector" : "Add Sector"}
        </ModalHeader>
        <Form
          className="tablelist-form"
          onSubmit={(e: any) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <ModalBody>
            <Row className="g-3">
              <Col lg={12}>
                <div>
                  <Label htmlFor="sectorName-field" className="form-label">
                    Sector Name*
                  </Label>
                  <Input
                    name="name"
                    id="sectorName-field"
                    className="form-control"
                    placeholder="Enter sector name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button onClick={toggle} type="button" className="btn btn-light">
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                disabled={validation.isSubmitting}
              >
                {validation.isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {!!isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{!!isEdit ? "Update" : "Add Sector"}</>
                )}
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default SectorsList;
