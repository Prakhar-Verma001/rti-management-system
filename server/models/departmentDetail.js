import mongoose from "mongoose";

const departmentDetailSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      enum: ["Finance Department", "Education Department", "Transport Department", "Health Department"],
      required: true,
      trim: true,
    },
    assignedOfficer: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DepartmentDetail = mongoose.model("DepartmentDetail", departmentDetailSchema);
export default DepartmentDetail;
