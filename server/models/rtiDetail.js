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
      required: true,
      trim: true,
    },
    applicationMode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
      trim: true,
    },
    dateOfReceipt: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    extendedDueDate: {
      type: Date,
      default: null,
    },
    reminderFrequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RtiDetail = mongoose.model("RtiDetail", rtiDetailSchema);
export default RtiDetail;
