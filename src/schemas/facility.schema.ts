import * as Yup from "yup";

export const facilitySchema = Yup.object({
  name: Yup.string()
    .required("Facility name is required")
    .min(3, "Facility name must be at least 3 characters")
    .max(100, "Facility name cannot exceed 100 characters"),

  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address cannot exceed 500 characters"),

  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  omlNumber: Yup.string()
    .required("OML Number is required")
    .matches(/^OML-\d+$/, "OML Number must be in format OML-123"),

  field: Yup.string()
    .required("Field name is required")
    .min(2, "Field name must be at least 2 characters"),

  installationTypeId: Yup.string().required("Installation type is required"),

  facilityTypeId: Yup.string().required("Facility type is required"),

  companyId: Yup.string().required("Company is required"),

  stateId: Yup.string().required("State is required"),

  lgaId: Yup.string()
    .required("LGA is required")
    .test("lga-valid", "Please select a valid LGA", function (value) {
      // This ensures LGA belongs to selected state
      if (!this.parent.stateId || !value) return false;
      return true;
    }),
});
