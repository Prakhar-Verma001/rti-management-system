import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CloudUpload,
} from "lucide-react";
import {
  createRTIApplication,
  getRTIApplicationById,
  updateRTIApplication,
} from "../../services/rtiService";

const inputClassName =
  "w-full h-11 border border-gray-300 rounded-lg px-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200";

const labelClassName =
  "block text-sm font-medium text-gray-700 mb-2";

const sectionTitleClassName =
  "text-lg font-semibold text-gray-900 mb-5";

const defaultFormValues = {
  rtiNo: "",
  applicantName: "",
  gender: "",
  contactNumber: "",
  email: "",
  address: "",
  subject: "",
  applicationMode: "",
  dateOfReceipt: "",
  description: "",
  department: "",
  assignedOfficer: "",
  dueDate: "",
  extendedDueDate: "",
  reminderFrequency: "",
};

const formatDateForInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const mapApplicationToFormValues = (application) => {
  const dept = application.department;
  const departmentName = dept && typeof dept === "object" ? (dept.departmentName || dept.name || "") : (dept || "");
  return {
    ...defaultFormValues,
    ...application,
    applicantName: application.applicant || application.applicantName || "",
    dateOfReceipt: formatDateForInput(application.dateOfReceipt || application.date || application.dateOfReceipt),
    rtiNo: application.rtiNo || "",
    department: departmentName,
    description: application.description || "",
    applicationMode: application.applicationMode || "",
    dueDate: formatDateForInput(application.dueDate),
    extendedDueDate: formatDateForInput(application.extendedDueDate),
    reminderFrequency: application.reminderFrequency || "",
    assignedOfficer: application.assignedOfficer || (dept && dept.assignedOfficer) || "",
  };
};

const RTICreateEditPage = ({
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [savingAction, setSavingAction] = useState(null); // 'draft' | 'submit' | null
  const [fieldToasts, setFieldToasts] = useState([]); // {id, field, message}

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
    mode: "onTouched",
  });

  const getInputClass = (fieldName) =>
    `${inputClassName} ${errors[fieldName] ? "border-red-500 focus:ring-red-100" : ""}`;

  const rtiNoValue = watch("rtiNo");

  useEffect(() => {
    if (!isEditMode) return;
    if (!id) return;

    setIsLoadingData(true);
    setServerError("");

    getRTIApplicationById(id)
      .then((data) => {
        if (data) {
          reset(mapApplicationToFormValues(data));
        } else {
          setServerError("RTI record not found.");
        }
      })
      .catch(() => {
        setServerError("Unable to load RTI data. Please try again.");
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  }, [id, isEditMode, reset]);

  const onSubmit = async (formData) => {
    setSavingAction("submit");
    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = { ...formData };
      // Ensure new submissions are marked as 'Pending' (matches backend enum)
      if (!isEditMode && !payload.status) payload.status = "Pending";

      if (isEditMode && id) {
        await updateRTIApplication(id, payload);
      } else {
        await createRTIApplication(payload);
      }

      navigate("/rti");
    } catch (err) {
      // If server returned field-level validation errors, apply them to the form
      const server = err?.server;
      if (server && Array.isArray(server.errors)) {
        server.errors.forEach((e) => {
          const field = e.field || e.param || e.path || "";
          if (field) setError(field, { type: "server", message: e.message });
          if (field) showFieldToast(field, e.message);
        });
        setServerError(server.message || "Validation failed on server");
      } else {
        setServerError(err?.message || "Unable to save the RTI record. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setSavingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    // Bypass form validation for Save Draft: clear any existing validation errors
    clearErrors();
    setSavingAction("draft");
    setIsSubmitting(true);
    setServerError("");

    try {
      const currentValues = getValues();
      const payload = { ...currentValues, status: "Draft" };

      if (isEditMode && id) {
        await updateRTIApplication(id, payload);
      } else {
        await createRTIApplication(payload);
      }

      // close form and return to list so table can refresh
      navigate("/rti");
    } catch (err) {
      const server = err?.server;
      if (server && Array.isArray(server.errors)) {
        server.errors.forEach((e) => {
          const field = e.field || e.param || e.path || "";
          if (field) setError(field, { type: "server", message: e.message });
          if (field) showFieldToast(field, e.message);
        });
        setServerError(server.message || "Validation failed on server");
      } else {
        setServerError(err?.message || "Unable to save draft. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setSavingAction(null);
    }
  };

  const showFieldToast = (field, message) => {
    const id = `${field}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setFieldToasts((prev) => [...prev, { id, field, message }]);
    // auto-dismiss
    setTimeout(() => {
      setFieldToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeFieldToast = (id) => {
    setFieldToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      {/* FORM HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="text-gray-700 hover:text-blue-700 transition-all duration-200"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit RTI" : "RTI Registration"}
        </h1>
      </div>

      {isLoadingData ? (
        <div className="p-8 text-center text-gray-500">
          Loading RTI details...
        </div>
      ) : (
        <>
          {serverError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Field-level toasts (top-right) */}
          {fieldToasts.length > 0 && (
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
              {fieldToasts.map((t) => (
                <div
                  key={t.id}
                  className="max-w-xs bg-red-600 text-white text-sm px-3 py-2 rounded shadow flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold">{t.field}</div>
                    <div className="text-xs">{t.message}</div>
                  </div>
                  <button
                    onClick={() => removeFieldToast(t.id)}
                    className="text-white opacity-80 hover:opacity-100 ml-2"
                    aria-label={`dismiss-${t.field}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* APPLICANT DETAILS */}
            <div>
              <h2 className={sectionTitleClassName}>Applicant Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClassName}>
                    Applicant Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter"
                    className={getInputClass("applicantName")}
                    {...register("applicantName", {
                      required: "Applicant Name is required",
                    })}
                  />
                  {errors.applicantName && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.applicantName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Gender <span className="text-red-500">*</span></label>

                  <select className={inputClassName} {...register("gender",{
                    required: "Gender is required",
                  })}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClassName}>
                    Contact Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter"
                    className={getInputClass("contactNumber")}
                    {...register("contactNumber", {
                      required: "Contact Number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter valid 10 digit number",
                      },
                    })}
                  />
                  {errors.contactNumber && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Email ID</label>

                  <input
                    type="email"
                    placeholder="Enter"
                    className={getInputClass("email")}
                    {...register("email", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClassName}>Address</label>

                  <input
                    type="text"
                    placeholder="Enter"
                    className={getInputClass("address")}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RTI DETAILS */}
            <div>
              <h2 className={sectionTitleClassName}>RTI Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className={labelClassName}>
                    RTI Case Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    disabled
                    {...register("rtiNo")}
                    value={rtiNoValue || "RTI/YYYY/DEPT/XXXX"}
                    placeholder="RTI/YYYY/DEPT/XXXX"
                    className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Subject <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter"
                    className={getInputClass("subject")}
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                  />
                  {errors.subject && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>
                    Application Mode <span className="text-red-500">*</span>
                  </label>

                  <select
                    className={getInputClass("applicationMode")}
                    {...register("applicationMode", {
                      required: "Application Mode is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option>Online</option>
                    <option>Offline</option>
                  </select>
                  {errors.applicationMode && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.applicationMode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClassName}>
                    Date of Receipt <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    className={getInputClass("dateOfReceipt")}
                    {...register("dateOfReceipt", {
                      required: "Date of Receipt is required",
                    })}
                  />
                  {errors.dateOfReceipt && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.dateOfReceipt.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Description</label>

                  <textarea
                    rows="1"
                    placeholder="Enter"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* DEPARTMENT DETAILS */}
            <div>
              <h2 className={sectionTitleClassName}>Department Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClassName}>
                    Department <span className="text-red-500">*</span>
                  </label>

                  <select
                    className={getInputClass("department")}
                    {...register("department", {
                      required: "Department is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option>Finance Department</option>
                    <option>Education Department</option>
                    <option>Transport Department</option>
                    <option>Health Department</option>
                  </select>
                  {errors.department && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Assigned Officer</label>

                  <select
                    className={inputClassName}
                    {...register("assignedOfficer")}
                  >
                    <option value="">Select</option>
                    <option>Officer 1</option>
                    <option>Officer 2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TIMELINE DETAILS */}
            <div>
              <h2 className={sectionTitleClassName}>Timeline Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClassName}>
                    Due Date <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      className={`${getInputClass("dueDate")} pr-10`}
                      {...register("dueDate", {
                        required: "Due Date is required",
                      })}
                    />
                    {errors.dueDate && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.dueDate.message}
                      </p>
                    )}

                    <CalendarDays
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Extended Due Date</label>

                  <div className="relative">
                    <input
                      type="date"
                      className={`${getInputClass("extendedDueDate")} pr-10`}
                      {...register("extendedDueDate")}
                    />
                    {errors.extendedDueDate && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.extendedDueDate.message}
                      </p>
                    )}

                    <CalendarDays
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>
                    Reminder Frequency <span className="text-red-500">*</span>
                  </label>

                  <select
                    className={getInputClass("reminderFrequency")}
                    {...register("reminderFrequency", {
                      required: "Reminder Frequency is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  {errors.reminderFrequency && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.reminderFrequency.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* UPLOAD DOCUMENTS */}
            <div>
              <h2 className={sectionTitleClassName}>Upload Documents</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Upload Application (PDF/Image)
                  </p>

                  <label className="border-dashed border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 cursor-pointer hover:border-blue-300 transition-all duration-200 min-h-[220px]">
                    <CloudUpload size={40} className="text-gray-400 mb-4" />

                    <p className="text-sm text-gray-600">
                      Drop file here or
                      <span className="text-blue-600 font-medium cursor-pointer ml-1">
                        Click to browse
                      </span>
                    </p>

                    <p className="text-xs text-gray-400 mt-3 leading-5">
                      Accepted: image/jpeg, image/jpg
                      <br />
                      Size: 20 KB - 100 KB
                    </p>

                    <input
                      type="file"
                      className="hidden"
                      {...register("uploadApplication")}
                    />
                  </label>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Additional Attachments
                  </p>

                  <label className="border-dashed border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 cursor-pointer hover:border-blue-300 transition-all duration-200 min-h-[220px]">
                    <CloudUpload size={40} className="text-gray-400 mb-4" />

                    <p className="text-sm text-gray-600">
                      Drop file here or
                      <span className="text-blue-600 font-medium cursor-pointer ml-1">
                        Click to browse
                      </span>
                    </p>

                    <p className="text-xs text-gray-400 mt-3 leading-5">
                      Accepted: image/jpeg, image/jpg
                      <br />
                      Size: 20 KB - 100 KB
                    </p>

                    <input
                      type="file"
                      multiple
                      className="hidden"
                      {...register("additionalAttachments")}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-blue-50 text-blue-900 font-medium hover:bg-blue-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && savingAction === "draft" ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Draft"
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-[#0B1F4D] text-white font-medium hover:bg-[#081735] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && savingAction === "submit" ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </span>
                ) : (
                  (isEditMode ? "Update RTI" : "Submit")
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default RTICreateEditPage;

