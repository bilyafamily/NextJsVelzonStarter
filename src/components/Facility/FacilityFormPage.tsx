"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Alert,
  Spinner,
  Badge,
} from "reactstrap";
import {
  MapPin,
  Building,
  Navigation,
  Globe,
  Save,
  X,
  Map,
  Edit,
} from "lucide-react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "src/components/Common/BreadCrumb";
import {
  useGetStates,
  useGetCompanies,
  useCreateFacility,
  useUpdateFacility,
  useGetFacilityById,
} from "src/hooks/facility.hook";
import dynamic from "next/dynamic";
import { useGetInstallationTypes } from "src/hooks/installation-type.hook";
import { useGetFacilityTypes } from "src/hooks/facility-type.hook";
import { FacilityType, InstallationType, ResponseDto } from "src/types/common";
import { facilitySchema } from "src/schemas/facility.schema";
import { useRouter, useParams } from "next/navigation";
import { CreateFacilityDto } from "src/types/facility";

const GoogleMapLocationPicker = dynamic(
  () => import("src/components/Maps/GoogleMapLocationPicker"),
  { ssr: false }
);

interface FacilityFormData {
  name: string;
  address: string;
  longitude: number | null;
  latitude: number | null;
  omlNumber: string;
  field: string;
  installationTypeId: string;
  facilityTypeId: string;
  companyId: string;
  stateId: string;
  lgaId: string;
}

const FacilityFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.id as string;
  const isEditMode = !!facilityId;

  // Fetch facility data if in edit mode
  const {
    data: existingFacility,
    isLoading: isFacilityLoading,
    isError: isFacilityError,
  } = useGetFacilityById(facilityId);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // API Hooks
  const { data: states = [], isLoading: statesLoading } = useGetStates();
  const { data: companies = [], isLoading: companiesLoading } =
    useGetCompanies();

  const { data: installationTypes = [], isLoading: installationTypesLoading } =
    useGetInstallationTypes();

  const { data: facilityTypes = [], isLoading: facilityTypesLoading } =
    useGetFacilityTypes();

  const createFacilityMutation = useCreateFacility();
  const updateFacilityMutation = useUpdateFacility();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (existingFacility && isEditMode) {
      formik.setValues({
        name: existingFacility.name || "",
        address: existingFacility.address || "",
        longitude: existingFacility.longitude || null,
        latitude: existingFacility.latitude || null,
        omlNumber: existingFacility.omlNumber || "",
        field: existingFacility.field || "",
        installationTypeId: existingFacility.installationTypeId || "",
        facilityTypeId: existingFacility.facilityTypeId || "",
        companyId: existingFacility.companyId || "",
        stateId: existingFacility.stateId || "",
        lgaId: existingFacility.lgaId || "",
      });

      if (existingFacility.latitude && existingFacility.longitude) {
        setSelectedLocation({
          lat: existingFacility.latitude,
          lng: existingFacility.longitude,
        });
      }
    }
  }, [existingFacility, isEditMode]);

  // Formik setup
  const formik = useFormik<FacilityFormData>({
    initialValues: {
      name: "",
      address: "",
      longitude: null,
      latitude: null,
      omlNumber: "",
      field: "",
      installationTypeId: "",
      facilityTypeId: "",
      companyId: "",
      stateId: "",
      lgaId: "",
    },
    enableReinitialize: true,
    validationSchema: facilitySchema,
    onSubmit: async values => {
      try {
        const facilityData: CreateFacilityDto = {
          name: values.name,
          address: values.address,
          longitude: values.longitude || 0,
          latitude: values.latitude || 0,
          omlNumber: values.omlNumber,
          field: values.field,
          installationTypeId: values.installationTypeId,
          facilityTypeId: values.facilityTypeId,
          companyId: values.companyId,
          stateId: values.stateId,
          lgaId: values.lgaId,
        };

        if (isEditMode) {
          // Update existing facility
          await updateFacilityMutation.mutateAsync(facilityData, {
            onSuccess: (response: ResponseDto) => {
              if (response.isSuccess) {
                toast.success("Facility updated successfully!");
                router.push("/admin/facilities");
              } else {
                toast.error(response.message || "Failed to update facility");
              }
            },
            onError: (error: any) => {
              toast.error(error.message || "An error occurred");
            },
          });
        } else {
          // Create new facility
          await createFacilityMutation.mutateAsync(facilityData, {
            onSuccess: response => {
              if (response.isSuccess) {
                toast.success("Facility created successfully!");
                formik.resetForm();
                router.push("/admin/facilities");
                setSelectedLocation(null);
              } else {
                toast.error(response.message || "Failed to create facility");
              }
            },
            onError: (error: any) => {
              toast.error(error.message || "An error occurred");
            },
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An unexpected error occurred");
      }
    },
  });

  const stateLgs =
    formik.values.stateId &&
    states.find(x => x.id === formik.values.stateId)?.lgas;

  useEffect(() => {
    if (formik.values.stateId) {
      formik.setFieldValue("lgaId", "");
    }
  }, [formik.values.stateId]);

  if (isEditMode && isFacilityLoading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  // Handle location selection from map
  const handleLocationSelect = (lat: number, lng: number) => {
    formik.setFieldValue("latitude", lat);
    formik.setFieldValue("longitude", lng);
    setSelectedLocation({ lat, lng });
    setIsMapModalOpen(false);
    toast.info(`Location set to: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(latitude, longitude);
        },
        error => {
          toast.error(`Unable to retrieve location: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Check if form is loading
  const isLoading =
    statesLoading ||
    companiesLoading ||
    installationTypesLoading ||
    facilityTypesLoading ||
    createFacilityMutation.isPending ||
    updateFacilityMutation.isPending ||
    (isEditMode && isFacilityLoading);

  if (isEditMode && isFacilityError) {
    return (
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Edit Facility"
            pageTitle="Facilities Management"
            parentLink="/admin/facilities"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="text-center py-5">
                  <Alert color="danger">
                    <h5>Facility not found</h5>
                    <p>The facility you're trying to edit does not exist.</p>
                    <Button
                      color="primary"
                      onClick={() => router.push("/admin/facilities")}
                    >
                      Back to Facilities
                    </Button>
                  </Alert>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={isEditMode ? "Edit Facility" : "Add New Facility"}
          pageTitle="Facilities Management"
          parentLink="/admin/facilities"
        />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="border-0 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-0">
                      {isEditMode ? (
                        <>
                          <Edit className="me-2" />
                          Edit Facility: {existingFacility?.name}
                        </>
                      ) : (
                        <>
                          <Building className="me-2" />
                          Register New Facility
                        </>
                      )}
                    </h5>
                    <p className="text-muted mb-0">
                      {isEditMode
                        ? "Update the details of the facility below"
                        : "Fill in the details below to add a new facility to the system"}
                    </p>
                  </div>
                  <Badge color={isEditMode ? "warning" : "primary"} pill>
                    {isEditMode ? "Editing Mode" : "Create Mode"}
                  </Badge>
                </div>
              </CardHeader>

              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    {/* Facility Basic Information */}
                    <Col lg={6}>
                      <div className="border rounded p-4 mb-4">
                        <h6 className="mb-3">
                          <Building size={18} className="me-2" />
                          Basic Information
                        </h6>

                        <FormGroup>
                          <Label for="name" className="fw-semibold">
                            Facility Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter facility name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.name && !!formik.errors.name
                            }
                            disabled={isLoading}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <FormFeedback>{formik.errors.name}</FormFeedback>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <Label for="address" className="fw-semibold">
                            Full Address <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="textarea"
                            id="address"
                            name="address"
                            placeholder="Enter complete address"
                            rows={3}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={
                              formik.touched.address && !!formik.errors.address
                            }
                            disabled={isLoading}
                          />
                          {formik.touched.address && formik.errors.address && (
                            <FormFeedback>{formik.errors.address}</FormFeedback>
                          )}
                        </FormGroup>
                      </div>

                      {/* Location Coordinates */}
                      <div className="border rounded p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">
                            <MapPin size={18} className="me-2" />
                            Location Coordinates
                          </h6>
                          <div className="d-flex gap-2">
                            <Button
                              color="outline-primary"
                              size="sm"
                              onClick={() => setIsMapModalOpen(true)}
                              disabled={isLoading}
                            >
                              <Map size={16} className="me-2" />
                              Select on Map
                            </Button>
                            <Button
                              color="outline-secondary"
                              size="sm"
                              onClick={handleCurrentLocation}
                              disabled={isLoading}
                            >
                              <Navigation size={16} className="me-2" />
                              Use Current Location
                            </Button>
                          </div>
                        </div>

                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="latitude" className="fw-semibold">
                                Latitude <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                id="latitude"
                                name="latitude"
                                placeholder="e.g., 4.8156"
                                step="0.000001"
                                value={formik.values.latitude || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.latitude &&
                                  !!formik.errors.latitude
                                }
                                disabled={isLoading}
                              />
                              {formik.touched.latitude &&
                                formik.errors.latitude && (
                                  <FormFeedback>
                                    {formik.errors.latitude}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md={6}>
                            <FormGroup>
                              <Label for="longitude" className="fw-semibold">
                                Longitude <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="number"
                                id="longitude"
                                name="longitude"
                                placeholder="e.g., 7.0498"
                                step="0.000001"
                                value={formik.values.longitude || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.longitude &&
                                  !!formik.errors.longitude
                                }
                                disabled={isLoading}
                              />
                              {formik.touched.longitude &&
                                formik.errors.longitude && (
                                  <FormFeedback>
                                    {formik.errors.longitude}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>
                        </Row>

                        {selectedLocation && (
                          <Alert color="info" className="mt-3">
                            <div className="d-flex align-items-center">
                              <MapPin size={16} className="me-2" />
                              <div>
                                <strong>Selected Location:</strong>
                                <div className="small">
                                  Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                                  {selectedLocation.lng.toFixed(6)}
                                </div>
                              </div>
                            </div>
                          </Alert>
                        )}
                      </div>
                    </Col>

                    {/* Facility Details */}
                    <Col lg={6}>
                      <div className="border rounded p-4 mb-4">
                        <h6 className="mb-3">
                          <Globe size={18} className="me-2" />
                          Facility Details
                        </h6>

                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="omlNumber" className="fw-semibold">
                                OML Number
                              </Label>
                              <Input
                                type="text"
                                id="omlNumber"
                                name="omlNumber"
                                placeholder="OML-123"
                                value={formik.values.omlNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isLoading}
                              />
                            </FormGroup>
                          </Col>

                          <Col md={6}>
                            <FormGroup>
                              <Label for="field" className="fw-semibold">
                                Field Name
                              </Label>
                              <Input
                                type="text"
                                id="field"
                                name="field"
                                placeholder="Enter field name"
                                value={formik.values.field}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isLoading}
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        {/* Dropdowns */}
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="companyId" className="fw-semibold">
                                Company <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="companyId"
                                name="companyId"
                                value={formik.values.companyId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.companyId &&
                                  !!formik.errors.companyId
                                }
                                disabled={isLoading || companiesLoading}
                              >
                                <option value="">Select Company</option>
                                {companies.map(company => (
                                  <option key={company.id} value={company.id}>
                                    {company.name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.companyId &&
                                formik.errors.companyId && (
                                  <FormFeedback>
                                    {formik.errors.companyId}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md={6}>
                            <FormGroup>
                              <Label
                                for="installationTypeId"
                                className="fw-semibold"
                              >
                                Installation Type{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="installationTypeId"
                                name="installationTypeId"
                                value={formik.values.installationTypeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.installationTypeId &&
                                  !!formik.errors.installationTypeId
                                }
                                disabled={isLoading || installationTypesLoading}
                              >
                                <option value="">
                                  Select Installation Type
                                </option>
                                {installationTypes.map(
                                  (type: InstallationType) => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  )
                                )}
                              </Input>
                              {formik.touched.installationTypeId &&
                                formik.errors.installationTypeId && (
                                  <FormFeedback>
                                    {formik.errors.installationTypeId}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label
                                for="facilityTypeId"
                                className="fw-semibold"
                              >
                                Facility Type{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="facilityTypeId"
                                name="facilityTypeId"
                                value={formik.values.facilityTypeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.facilityTypeId &&
                                  !!formik.errors.facilityTypeId
                                }
                                disabled={isLoading || facilityTypesLoading}
                              >
                                <option value="">Select Facility Type</option>
                                {facilityTypes.map((type: FacilityType) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.facilityTypeId &&
                                formik.errors.facilityTypeId && (
                                  <FormFeedback>
                                    {formik.errors.facilityTypeId}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>

                      {/* Location Dropdowns */}
                      <div className="border rounded p-4 mb-4">
                        <h6 className="mb-3">
                          <MapPin size={18} className="me-2" />
                          Geographic Location
                        </h6>

                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="stateId" className="fw-semibold">
                                State <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="stateId"
                                name="stateId"
                                value={formik.values.stateId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.stateId &&
                                  !!formik.errors.stateId
                                }
                                disabled={isLoading || statesLoading}
                              >
                                <option value="">Select State</option>
                                {states.map(state => (
                                  <option key={state.id} value={state.id}>
                                    {state.name}
                                  </option>
                                ))}
                              </Input>
                              {formik.touched.stateId &&
                                formik.errors.stateId && (
                                  <FormFeedback>
                                    {formik.errors.stateId}
                                  </FormFeedback>
                                )}
                            </FormGroup>
                          </Col>

                          <Col md={6}>
                            <FormGroup>
                              <Label for="lgaId" className="fw-semibold">
                                LGA <span className="text-danger">*</span>
                              </Label>
                              <Input
                                type="select"
                                id="lgaId"
                                name="lgaId"
                                value={formik.values.lgaId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={
                                  formik.touched.lgaId && !!formik.errors.lgaId
                                }
                                disabled={
                                  isLoading ||
                                  !formik.values.stateId ||
                                  !stateLgs
                                }
                              >
                                <option value="">
                                  {!formik.values.stateId
                                    ? "Select State First"
                                    : "Select LGA"}
                                </option>
                                {stateLgs &&
                                  stateLgs?.map(lga => (
                                    <option key={lga.id} value={lga.id}>
                                      {lga.name}
                                    </option>
                                  ))}
                              </Input>
                              {formik.touched.lgaId && formik.errors.lgaId && (
                                <FormFeedback>
                                  {formik.errors.lgaId}
                                </FormFeedback>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>

                  {/* Form Actions */}
                  <div className="border-top pt-4 mt-4">
                    <div className="d-flex justify-content-between">
                      <Button
                        color="secondary"
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure? All unsaved changes will be lost."
                            )
                          ) {
                            formik.resetForm();
                            setSelectedLocation(null);
                          }
                        }}
                        disabled={isLoading}
                      >
                        <X size={16} className="me-2" />
                        Reset Form
                      </Button>

                      <div className="d-flex gap-3">
                        <Button
                          color="outline-danger"
                          type="button"
                          onClick={() => router.push("/admin/facilities")}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>

                        <Button
                          color={isEditMode ? "warning" : "success"}
                          type="submit"
                          disabled={
                            isLoading || !formik.isValid || !formik.dirty
                          }
                          className="px-5"
                        >
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              {isEditMode ? "Updating..." : "Saving..."}
                            </>
                          ) : (
                            <>
                              {isEditMode ? (
                                <Edit size={16} className="me-2" />
                              ) : (
                                <Save size={16} className="me-2" />
                              )}
                              {isEditMode ? "Update Facility" : "Save Facility"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Google Maps Modal */}
      {isMapModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Map size={20} className="me-2" />
                  Select Facility Location
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsMapModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <GoogleMapLocationPicker
                  initialLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  height="500px"
                />
              </div>
              <div className="modal-footer">
                <Button
                  color="secondary"
                  onClick={() => setIsMapModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button color="primary" onClick={handleCurrentLocation}>
                  <Navigation size={16} className="me-2" />
                  Use Current Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityFormPage;
