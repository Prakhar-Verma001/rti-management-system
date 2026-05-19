import mongoose from "mongoose";

const rtiDetailSchema = new mongoose.Schema(
  {
    rtiNo: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    applicationMode: {
      type: String,
      enum: ["Online", "Offline"],
      trim: true,
    },
    dateOfReceipt: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    extendedDueDate: {
      type: Date,
      default: null,
    },
    reminderFrequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Verified", "Pending", "Rejected", "Draft"],
      default: "Draft",
      trim: true,
    },
    uploadApplication: {
      type: String,
      trim: true,
      default: "",
    },
    additionalAttachments: {
      type: [String],
      default: [],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentDetail",
    },
  },
  {
    timestamps: true,
  }
);

const RtiDetail = mongoose.model("RtiDetail", rtiDetailSchema);
export default RtiDetail;
