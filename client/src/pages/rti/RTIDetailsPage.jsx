import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, FileText } from "lucide-react"
import { getRTIApplicationById } from "../../services/rtiService"

const sectionTitleClassName =
  "text-lg font-semibold text-gray-900 mb-5"

const labelClassName =
  "text-sm font-medium text-gray-500 mb-1"

const valueClassName =
  "text-sm text-gray-900 font-medium leading-6"

const DocumentPreviewCard = ({ title }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>

      <div className="w-[170px] h-[220px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
        <div className="h-10 bg-gray-200 flex items-center px-3">
          <div className="w-8 h-2 rounded bg-gray-300"></div>
        </div>

        <div className="p-4 flex flex-col justify-between h-[180px]">
          <div className="space-y-2">
            <div className="w-full h-2 rounded bg-gray-200"></div>
            <div className="w-5/6 h-2 rounded bg-gray-200"></div>
            <div className="w-4/6 h-2 rounded bg-gray-200"></div>

            <div className="pt-5 flex justify-center">
              <FileText size={55} className="text-gray-300" />
            </div>
          </div>

          <div className="w-12 h-12 rounded-lg bg-blue-600 ml-auto"></div>
        </div>
      </div>
    </div>
  )
}

const DetailItem = ({ label, value, className = "" }) => {
  return (
    <div className={className}>
      <p className={labelClassName}>{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  )
}

const RTIDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const applicationId = id
    if (!applicationId) {
      setError("Invalid RTI ID.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    getRTIApplicationById(applicationId)
      .then((data) => {
        if (!data) {
          setError("RTI record not found.")
        } else {
          setApplication(data)
        }
      })
      .catch(() => {
        setError("Unable to load RTI details. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleBack = () => navigate(-1)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 text-center text-gray-500">
        Loading RTI details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 md:p-8 text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="text-gray-700 hover:text-blue-700 transition-all duration-200"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-gray-900">RTI Registration Details</h1>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className={sectionTitleClassName}>Applicant Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DetailItem label="Applicant Name" value={application.applicant || "N/A"} />
            <DetailItem label="Gender" value={application.gender || "N/A"} />
            <DetailItem label="Contact Number" value={application.contactNumber || "N/A"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Email ID" value={application.email || "N/A"} />
            <DetailItem
              label="Address"
              value={application.address || "N/A"}
              className="md:col-span-2"
            />
          </div>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>RTI Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <DetailItem label="RTI Case Number" value={application.rtiNo || "N/A"} />
            <DetailItem label="Subject" value={application.subject || "N/A"} />
            <DetailItem label="Application Mode" value={application.applicationMode || "N/A"} />
            <DetailItem label="Date of Receipt" value={application.dateOfReceipt || application.date || "N/A"} />
          </div>

          <DetailItem label="Description" value={application.description || "N/A"} />
        </div>

        <div>
          <h2 className={sectionTitleClassName}>Department Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="Department" value={application.department || "N/A"} />
            <DetailItem label="Assigned Officer" value={application.assignedOfficer || "N/A"} />
          </div>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>Timeline Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailItem label="Due Date" value={application.dueDate || "N/A"} />
            <DetailItem label="Extended Due Date" value={application.extendedDueDate || "N/A"} />
            <DetailItem label="Reminder Frequency" value={application.reminderFrequency || "N/A"} />
          </div>
        </div>

        <div>
          <h2 className={sectionTitleClassName}>Uploaded Documents Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocumentPreviewCard title="Upload Application" />
            <DocumentPreviewCard title="Additional Attachments" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RTIDetailsPage;
