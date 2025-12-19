import * as Yup from "yup";

export const templateSchema = Yup.object().shape({
  name: Yup.string()
    .required("Template name is required")
    .min(3, "Template name must be at least 3 characters")
    .max(100, "Template name must not exceed 100 characters"),

  fileType: Yup.string()
    .required("File type is required")
    .oneOf(
      [
        "doc",
        "docx",
        "pdf",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "txt",
        "png",
        "jpeg",
        "gif",
      ],
      "Unsupported file type"
    ),

  file: Yup.mixed()
    .required("File is required")
    .test(
      "fileSize",
      "File size must be less than 10MB",
      value => !value || (value as File).size <= 10 * 1024 * 1024
    )
    .test("fileType", "Unsupported file format", value => {
      if (!value) return true;
      const file = value as File;
      const validTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ];
      return validTypes.includes(file.type);
    }),

  isActive: Yup.boolean(),
});
