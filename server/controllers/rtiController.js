import mongoose from "mongoose";
import Applicant from "../models/applicant.js";
import DepartmentDetail from "../models/departmentDetail.js";
import RtiDetail from "../models/rtiDetail.js";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeUpload = (val) => {
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val)) return val.map((v) => (typeof v === "string" ? v.trim() : JSON.stringify(v))).join(",");
  if (val && typeof val === "object") return JSON.stringify(val);
  return "";
};

const buildPayload = (body) => ({
  applicantName: body.applicantName?.trim() || "",
  gender: body.gender?.trim() || "",
  contactNumber: body.contactNumber?.trim() || "",
  email: body.email?.trim() || "",
  address: body.address?.trim() || "",
  subject: body.subject?.trim() || "",
  applicationMode: body.applicationMode?.trim() || "",
  dateOfReceipt: body.dateOfReceipt ? new Date(body.dateOfReceipt) : null,
  description: body.description?.trim() || "",
  departmentName: body.department?.trim() || "",
  assignedOfficer: body.assignedOfficer?.trim() || "",
  dueDate: body.dueDate ? new Date(body.dueDate) : null,
  extendedDueDate: body.extendedDueDate ? new Date(body.extendedDueDate) : null,
  reminderFrequency: body.reminderFrequency?.trim() || "",
  status: body.status?.trim() || "Draft",
  uploadApplication: normalizeUpload(body.uploadApplication),
  additionalAttachments: Array.isArray(body.additionalAttachments) ? body.additionalAttachments : [],
  rtiNo: body.rtiNo?.trim() || "",
});

const findOrCreateDepartment = async ({ departmentName, assignedOfficer }) => {
  const query = {
    departmentName,
    assignedOfficer,
  };

  let department = await DepartmentDetail.findOne(query);
  if (!department) {
    department = await DepartmentDetail.create({ departmentName, assignedOfficer });
  }

  return department;
};

const transformApplicant = (applicant) => {
  // Convert mongoose document to plain object if needed
  const object = typeof applicant.toObject === "function" ? applicant.toObject({ virtuals: true }) : applicant;

  // If nested fields are mongoose documents (have toObject), convert them; otherwise leave as plain objects
  if (
    object.rtiDetail &&
    object.rtiDetail.department &&
    typeof object.rtiDetail.department.toObject === "function"
  ) {
    object.rtiDetail.department = object.rtiDetail.department.toObject({ virtuals: true });
  }

  if (object.department && typeof object.department.toObject === "function") {
    object.department = object.department.toObject({ virtuals: true });
  }

  return object;
};

export const getRTIApplications = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
    const search = req.query.search || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const status = req.query.status || "";
    const department = req.query.department || "";

    const match = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      // Only search by applicant name and RTI number
      match.$or = [{ applicantName: regex }, { "rtiDetail.rtiNo": regex }];
    }

    if (status && status !== "All Status") {
      match["rtiDetail.status"] = status;
    }

    if (department && department !== "All Departments") {
      match["department.departmentName"] = department;
    }

    if (startDate || endDate) {
      match["rtiDetail.dateOfReceipt"] = {};
      if (startDate) {
        match["rtiDetail.dateOfReceipt"].$gte = new Date(startDate);
      }
      if (endDate) {
        match["rtiDetail.dateOfReceipt"].$lte = new Date(endDate);
      }
    }

    const pipeline = [
      {
        $lookup: {
          from: "rtidetails",
          localField: "rtiDetail",
          foreignField: "_id",
          as: "rtiDetail",
        },
      },
      { $unwind: "$rtiDetail" },
      {
        $lookup: {
          from: "departmentdetails",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: "$department" },
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      } },
      { $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true } },
      { $project: { data: 1, total: "$metadata.total" } },
    ];

    const result = await Applicant.aggregate(pipeline);
    const data = result[0]?.data || [];
    const total = result[0]?.total || 0;

    // Map aggregated documents to flat shape expected by frontend
    const mapped = data.map((item) => ({
      id: item._id,
      rtiNo: item.rtiDetail?.rtiNo || "",
      applicant: item.applicantName || "",
      department: item.department?.departmentName || item.department || "",
      date: item.rtiDetail?.dateOfReceipt || item.createdAt || null,
      status: item.rtiDetail?.status || "",
    }));

    return res.json({ data: mapped, total, page, pageSize });
  } catch (error) {
    next(error);
  }
};

export const getRTIApplicationById = async (req, res, next) => {
  try {
    const application = await Applicant.findById(req.params.id)
      .populate("department")
      .populate({ path: "rtiDetail", populate: "department" });

    if (!application) {
      return res.status(404).json({ message: "RTI record not found" });
    }

    return res.json(transformApplicant(application));
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(404).json({ message: "RTI record not found" });
    }
    next(error);
  }
};

export const createRTIApplication = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body);
    const department = await findOrCreateDepartment(payload);

    const count = await RtiDetail.countDocuments();
    const rtiNo = payload.rtiNo || `RTI-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const rtiDetail = await RtiDetail.create({
      rtiNo,
      subject: payload.subject,
      applicationMode: payload.applicationMode,
      dateOfReceipt: payload.dateOfReceipt,
      description: payload.description,
      dueDate: payload.dueDate,
      extendedDueDate: payload.extendedDueDate,
      reminderFrequency: payload.reminderFrequency,
      status: payload.status,
      uploadApplication: payload.uploadApplication,
      additionalAttachments: payload.additionalAttachments,
      department: department._id,
    });

    const applicant = await Applicant.create({
      applicantName: payload.applicantName,
      gender: payload.gender,
      contactNumber: payload.contactNumber,
      email: payload.email,
      address: payload.address,
      department: department._id,
      rtiDetail: rtiDetail._id,
    });

    const response = await Applicant.findById(applicant._id)
      .populate("department")
      .populate({ path: "rtiDetail", populate: "department" });

    return res.status(201).json(transformApplicant(response));
  } catch (error) {
    next(error);
  }
};

export const updateRTIApplication = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body);
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ message: "RTI record not found" });
    }

    const department = await findOrCreateDepartment(payload);
    applicant.applicantName = payload.applicantName;
    applicant.gender = payload.gender;
    applicant.contactNumber = payload.contactNumber;
    applicant.email = payload.email;
    applicant.address = payload.address;
    applicant.department = department._id;

    await applicant.save();

    const rtiDetail = await RtiDetail.findById(applicant.rtiDetail);
    if (!rtiDetail) {
      return res.status(404).json({ message: "RTI detail record not found" });
    }

    rtiDetail.rtiNo = payload.rtiNo || rtiDetail.rtiNo;
    rtiDetail.subject = payload.subject;
    rtiDetail.applicationMode = payload.applicationMode;
    rtiDetail.dateOfReceipt = payload.dateOfReceipt;
    rtiDetail.description = payload.description;
    rtiDetail.dueDate = payload.dueDate;
    rtiDetail.extendedDueDate = payload.extendedDueDate;
    rtiDetail.reminderFrequency = payload.reminderFrequency;
    rtiDetail.status = payload.status;
    rtiDetail.uploadApplication = payload.uploadApplication;
    rtiDetail.additionalAttachments = payload.additionalAttachments;
    rtiDetail.department = department._id;

    await rtiDetail.save();

    const response = await Applicant.findById(applicant._id)
      .populate("department")
      .populate({ path: "rtiDetail", populate: "department" });

    return res.json(transformApplicant(response));
  } catch (error) {
    next(error);
  }
};

export const deleteRTIApplication = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ message: "RTI record not found" });
    }

    await RtiDetail.findByIdAndDelete(applicant.rtiDetail);
    await applicant.deleteOne();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};


