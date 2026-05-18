import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import NoDataFound from "../../components/common/NoDataFound";
import {
  deleteRTIApplication,
  getRTIApplications,
} from "../../services/rtiService";

const getStatusClasses = (status) => {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Draft":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const statusOptions = [
  "All Status",
  "Verified",
  "Pending",
  "Rejected",
  "Draft",
];

const departmentOptions = [
  "All Departments",
  "Finance Department",
  "Education Department",
  "Transport Department",
  "Health Department",
];

const RTIListPage = () => {
  const { searchText, searchQuery, handleSearchChange } = useOutletContext();

  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const firstItemIndex = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, totalRecords);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter, departmentFilter]);

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      setIsLoading(true);
      setError("");

      try {
        const { data, total } = await getRTIApplications({
          page: currentPage,
          pageSize,
          search: searchQuery,
          startDate,
          endDate,
          status: statusFilter,
          department: departmentFilter,
        });

        if (!active) return;

        setApplications(data);
        setTotalRecords(total);
      } catch (err) {
        if (!active) return;
        setError("Unable to load applications. Please try again later.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, [currentPage, pageSize, searchQuery, startDate, endDate, statusFilter, departmentFilter]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);
  const handleStatusChange = (event) => setStatusFilter(event.target.value);
  const handleDepartmentChange = (event) => setDepartmentFilter(event.target.value);

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError("");

    try {
      await deleteRTIApplication(id);
      // TODO: call delete RTI API endpoint here
      const { data, total } = await getRTIApplications({
        page: currentPage,
        pageSize,
        search: searchQuery,
        startDate,
        endDate,
        status: statusFilter,
        department: departmentFilter,
      });

      setApplications(data);
      setTotalRecords(total);
    } catch (err) {
      setError("Unable to delete the application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = applications.length > 0;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-end">
        <Link
          to="/rti/create"
          className="inline-flex items-center justify-center gap-2 bg-[#0B4EA2] hover:bg-[#083c7a] text-white px-5 h-12 rounded-xl font-medium transition-all duration-200"
        >
          <Plus size={18} />
          RTI Registration
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* TABLE TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            RTI Applications
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-11 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              {/* DEPARTMENT FILTER */}
              <select
                value={departmentFilter}
                onChange={handleDepartmentChange}
                className="h-11 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="h-11 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="h-11 border border-gray-300 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        {hasData ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-[#F8FAFC] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      RTI No
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-[#0B4EA2]">
                        {item.rtiNo}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {item.applicant}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {item.department}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {item.date}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          {/* VIEW */}
                          <Link
                            to={`/rti/${item.id}`}
                            className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all duration-200"
                          >
                            <Eye size={17} />
                          </Link>

                          {/* EDIT */}
                          <Link
                            to={`/rti/edit/${item.id}`}
                            className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center hover:bg-yellow-100 transition-all duration-200"
                          >
                            <Pencil size={17} />
                          </Link>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all duration-200"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-t border-gray-100">
              {/* COUNT */}
              <div>
                <p className="text-sm text-gray-500">
                  Showing {firstItemIndex} to {lastItemIndex} of {totalRecords} entries
                </p>
              </div>

              {/* PAGINATION BUTTONS */}
              <div className="flex items-center gap-2">
                {/* PREVIOUS */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* PAGES */}
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#0B4EA2] text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* NEXT */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading RTI applications...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-500">
            {error}
          </div>
        ) : (
          <NoDataFound
            title="No RTI Records Found"
            description="No RTI applications match the current filters."
          />
        )}
      </div>
    </div>
  );
};

export default RTIListPage;