const mockRTIApplications = [
  {
    id: 1,
    rtiNo: "RTI-2026-001",
    applicant: "Rahul Sharma",
    department: "Finance Department",
    date: "2026-04-12",
    status: "Verified",
  },
  {
    id: 2,
    rtiNo: "RTI-2026-002",
    applicant: "Anjali Verma",
    department: "Education Department",
    date: "2026-04-13",
    status: "Pending",
  },
  {
    id: 3,
    rtiNo: "RTI-2026-003",
    applicant: "Amit Singh",
    department: "Transport Department",
    date: "2026-04-14",
    status: "Rejected",
  },
  {
    id: 4,
    rtiNo: "RTI-2026-004",
    applicant: "Priya Kapoor",
    department: "Health Department",
    date: "2026-04-15",
    status: "Draft",
  },
  {
    id: 5,
    rtiNo: "RTI-2026-005",
    applicant: "Sunita Choudhary",
    department: "Finance Department",
    date: "2026-04-16",
    status: "Pending",
  },
  {
    id: 6,
    rtiNo: "RTI-2026-006",
    applicant: "Vikram Joshi",
    department: "Education Department",
    date: "2026-04-17",
    status: "Verified",
  },
  {
    id: 7,
    rtiNo: "RTI-2026-007",
    applicant: "Nisha Patel",
    department: "Transport Department",
    date: "2026-04-18",
    status: "Pending",
  },
  {
    id: 8,
    rtiNo: "RTI-2026-008",
    applicant: "Karan Mehra",
    department: "Health Department",
    date: "2026-04-19",
    status: "Verified",
  },
  {
    id: 9,
    rtiNo: "RTI-2026-009",
    applicant: "Sonal Reddy",
    department: "Finance Department",
    date: "2026-04-20",
    status: "Rejected",
  },
  {
    id: 10,
    rtiNo: "RTI-2026-010",
    applicant: "Deepak Kumar",
    department: "Education Department",
    date: "2026-04-21",
    status: "Draft",
  },
  {
    id: 11,
    rtiNo: "RTI-2026-011",
    applicant: "Neha Rani",
    department: "Transport Department",
    date: "2026-04-22",
    status: "Verified",
  },
  {
    id: 12,
    rtiNo: "RTI-2026-012",
    applicant: "Akash Singh",
    department: "Health Department",
    date: "2026-04-23",
    status: "Pending",
  },
  {
    id: 13,
    rtiNo: "RTI-2026-013",
    applicant: "Pooja Sharma",
    department: "Finance Department",
    date: "2026-04-24",
    status: "Verified",
  },
  {
    id: 14,
    rtiNo: "RTI-2026-014",
    applicant: "Rohit Nair",
    department: "Education Department",
    date: "2026-04-25",
    status: "Rejected",
  },
  {
    id: 15,
    rtiNo: "RTI-2026-015",
    applicant: "Seema Verma",
    department: "Transport Department",
    date: "2026-04-26",
    status: "Draft",
  },
  {
    id: 16,
    rtiNo: "RTI-2026-016",
    applicant: "Manish Gupta",
    department: "Health Department",
    date: "2026-04-27",
    status: "Verified",
  },
  {
    id: 17,
    rtiNo: "RTI-2026-017",
    applicant: "Rekha Iyer",
    department: "Finance Department",
    date: "2026-04-28",
    status: "Pending",
  },
  {
    id: 18,
    rtiNo: "RTI-2026-018",
    applicant: "Tarun Paul",
    department: "Education Department",
    date: "2026-04-29",
    status: "Verified",
  },
  {
    id: 19,
    rtiNo: "RTI-2026-019",
    applicant: "Lata Joshi",
    department: "Transport Department",
    date: "2026-04-30",
    status: "Rejected",
  },
  {
    id: 20,
    rtiNo: "RTI-2026-020",
    applicant: "Nikhil Jain",
    department: "Health Department",
    date: "2026-05-01",
    status: "Draft",
  },
  {
    id: 21,
    rtiNo: "RTI-2026-021",
    applicant: "Sanya Kapoor",
    department: "Finance Department",
    date: "2026-05-02",
    status: "Verified",
  },
  {
    id: 22,
    rtiNo: "RTI-2026-022",
    applicant: "Aarav Khanna",
    department: "Education Department",
    date: "2026-05-03",
    status: "Pending",
  },
  {
    id: 23,
    rtiNo: "RTI-2026-023",
    applicant: "Rhea Mishra",
    department: "Transport Department",
    date: "2026-05-04",
    status: "Verified",
  },
  {
    id: 24,
    rtiNo: "RTI-2026-024",
    applicant: "Siddharth Rao",
    department: "Health Department",
    date: "2026-05-05",
    status: "Rejected",
  },
  {
    id: 25,
    rtiNo: "RTI-2026-025",
    applicant: "Isha Desai",
    department: "Finance Department",
    date: "2026-05-06",
    status: "Pending",
  },
  {
    id: 26,
    rtiNo: "RTI-2026-026",
    applicant: "Rahul Mehta",
    department: "Education Department",
    date: "2026-05-07",
    status: "Verified",
  },
];

function applyDateFilter(items, startDate, endDate) {
  return items.filter((item) => {
    const itemDate = new Date(item.date);

    if (startDate) {
      const start = new Date(startDate);
      if (itemDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (itemDate > end) return false;
    }

    return true;
  });
}

function applySearchFilter(items, search) {
  if (!search) return items;

  const normalizedQuery = search.toLowerCase().trim();
  return items.filter((item) => {
    return [item.rtiNo, item.applicant, item.department, item.status]
      .some((field) => field.toLowerCase().includes(normalizedQuery));
  });
}

function applyStatusFilter(items, status) {
  if (!status || status === "All Status") return items;
  return items.filter((item) => item.status === status);
}

function applyDepartmentFilter(items, department) {
  if (!department || department === "All Departments") return items;
  return items.filter((item) => item.department === department);
}

export function getRTIApplications({
  page = 1,
  pageSize = 10,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  department = "",
}) {
  return new Promise((resolve) => {
    let results = applySearchFilter(mockRTIApplications, search);
    results = applyStatusFilter(results, status);
    results = applyDepartmentFilter(results, department);
    results = applyDateFilter(results, startDate, endDate);

    const total = results.length;
    const start = (page - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    setTimeout(() => {
      resolve({ data: paginated, total });
    }, 300);
  });
}

export function getRTIApplicationById(id) {
  return new Promise((resolve) => {
    const application = mockRTIApplications.find((item) => item.id === id) || null;
    setTimeout(() => {
      resolve(application);
    }, 200);
  });
}

export function createRTIApplication(data) {
  return new Promise((resolve) => {
    const nextId = mockRTIApplications.length
      ? Math.max(...mockRTIApplications.map((item) => item.id)) + 1
      : 1;

    const newApplication = {
      id: nextId,
      rtiNo: data.rtiNo || `RTI-2026-${String(nextId).padStart(3, "0")}`,
      date: data.dateOfReceipt || new Date().toISOString().slice(0, 10),
      status: data.status || "Draft",
      applicant: data.applicantName || "Unknown",
      department: data.department || "N/A",
      ...data,
    };

    mockRTIApplications.unshift(newApplication);

    setTimeout(() => {
      resolve(newApplication);
    }, 300);
  });
}

export function updateRTIApplication(id, data) {
  return new Promise((resolve) => {
    const index = mockRTIApplications.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockRTIApplications[index] = {
        ...mockRTIApplications[index],
        ...data,
        applicant: data.applicantName || mockRTIApplications[index].applicant,
       department: data.department || mockRTIApplications[index].department,
        status: data.status || mockRTIApplications[index].status,
        date: data.dateOfReceipt || mockRTIApplications[index].date,
      };
    }

    setTimeout(() => {
      resolve(mockRTIApplications[index] || null);
    }, 300);
  });
}

export function deleteRTIApplication(id) {
  return new Promise((resolve) => {
    const index = mockRTIApplications.findIndex((item) => item.id === id);
    const success = index !== -1;

    if (success) {
      mockRTIApplications.splice(index, 1);
    }

    setTimeout(() => {
      resolve({ success });
    }, 300);
  });
}
