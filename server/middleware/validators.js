import { body, param, validationResult } from "express-validator";

const validDepartments = [
  "Finance Department",
  "Education Department",
  "Transport Department",
  "Health Department",
];

const validApplicationModes = ["Online", "Offline"];
const validReminderFrequencies = ["Daily", "Weekly", "Monthly"];
const validGenders = ["Male", "Female", "Other"];

export const validateIdParam = [
  param("id").isMongoId().withMessage("RTI ID must be a valid MongoDB ObjectId"),
];

export const validateRTIApplication = [
  // Only enforce required/strict validators when status is not Draft
  body().custom((_, { req }) => {
    const s = req.body.status;
    const isDraft = s && typeof s === "string" && s.toLowerCase() === "draft";
    // Attach a flag to request for reuse in individual validators if needed
    req._isDraft = !!isDraft;
    return true;
  }),
  body("applicantName")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Applicant Name is required"),
  body("contactNumber")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Contact Number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Contact Number must be 10 digits"),
  body("subject")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Subject is required"),
  body("applicationMode")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Application Mode is required")
    .isIn(validApplicationModes)
    .withMessage("Application Mode must be Online or Offline"),
  body("dateOfReceipt")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Date of Receipt is required")
    .isISO8601()
    .withMessage("Date of Receipt must be a valid date"),
  body("department")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .isIn(validDepartments)
    .withMessage("Department is invalid"),
  body("dueDate")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Due Date is required")
    .isISO8601()
    .withMessage("Due Date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.dateOfReceipt && new Date(value) < new Date(req.body.dateOfReceipt)) {
        throw new Error("Due Date cannot be before Date of Receipt");
      }
      return true;
    }),
  body("extendedDueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Extended Due Date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.dueDate && new Date(value) < new Date(req.body.dueDate)) {
        throw new Error("Extended Due Date cannot be before Due Date");
      }
      return true;
    }),
  body("reminderFrequency")
    .if((_, { req }) => !req._isDraft)
    .trim()
    .notEmpty()
    .withMessage("Reminder Frequency is required")
    .isIn(validReminderFrequencies)
    .withMessage("Reminder Frequency must be Daily, Weekly, or Monthly"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Email must be valid"),
  body("gender")
    .optional({ nullable: true, checkFalsy: true })
    .isIn(validGenders)
    .withMessage("Gender must be Male, Female, or Other"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((error) => ({ field: error.param, message: error.msg }));
  // Log validation failures for easier debugging
  console.error("Validation failed:", JSON.stringify(formatted));
  return res.status(400).json({ message: "Validation failed", errors: formatted });
};
