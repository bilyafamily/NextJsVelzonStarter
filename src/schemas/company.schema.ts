import * as yup from "yup";

export const companychema = yup.object({
  name: yup.string().required("Company name is required"),
  sectorId: yup.string().required("Sector is required"),
  address: yup.string().required("Address is required"),
  contactEmail: yup
    .string()
    .email("Invalid email format")
    .required("Contact email is required"),
  contactPhone: yup
    .string()
    // .matches(
    //   /^[\+]?[1-9][\d]?[-\s\.]?\(?[1-9]\d{2}\)?[-\s\.]?\d{3}[-\s\.]?\d{4}$/,
    //   "Invalid phone number format"
    // )
    .required("Contact phone is required"),
  isActive: yup.boolean().default(true),
});
