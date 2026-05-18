import fs from "fs/promises";
import path from "path";

const dataFilePath = path.resolve(new URL("../data/rtiApplications.json", import.meta.url).pathname);

const defaultApplications = [
  {
    id: 1,
    rtiNo: "RTI-2026-001",
    applicantName: "Rahul Sharma",
    applicant: "Rahul Sharma",
    gender: "Male",
    contactNumber: "9876543210",
    email: "rahul.sharma@example.com",
    address: "123 Ashoka Road, New Delhi",
    subject: "Information on budget allocations",
    applicationMode: "Online",
    dateOfReceipt: "2026-04-12",
    date: "2026-04-12",
    description: "Requesting details on budget use for education.",
    department: "Finance Department",
    assignedOfficer: "Officer 1",
    dueDate: "2026-04-22",
    extendedDueDate: "2026-04-27",
    reminderFrequency: "Weekly",
    status: "Verified",
  },
  {
    id: 2,
    rtiNo: "RTI-2026-002",
    applicantName: "Anjali Verma",
    applicant: "Anjali Verma",
    gender: "Female",
    contactNumber: "9123456780",
    email: "anjali.verma@example.com",
    address: "456 Gandhi Marg, Jaipur",
    subject: "School grant details",
    applicationMode: "Offline",
    dateOfReceipt: "2026-04-13",
    date: "2026-04-13",
    description: "Need details on school grant disbursement.",
    department: "Education Department",
    assignedOfficer: "Officer 2",
    dueDate: "2026-04-23",
    extendedDueDate: "2026-04-27",
    reminderFrequency: "Daily",
    status: "Pending",
  },
  {
    id: 3,
    rtiNo: "RTI-2026-003",
    applicantName: "Amit Singh",
    applicant: "Amit Singh",
    gender: "Male",
    contactNumber: "9988776655",
    email: "amit.singh@example.com",
    address: "789 Ring Road, Lucknow",
    subject: "Transport licensing information",
    applicationMode: "Online",
    dateOfReceipt: "2026-04-14",
    date: "2026-04-14",
    description: "Please provide transport licensing data.",
    department: "Transport Department",
    assignedOfficer: "Officer 1",
    dueDate: "2026-04-24",
    extendedDueDate: "2026-04-30",
    reminderFrequency: "Monthly",
    status: "Rejected",
  },
  {
    id: 4,
    rtiNo: "RTI-2026-004",
    applicantName: "Priya Kapoor",
    applicant: "Priya Kapoor",
    gender: "Female",
    contactNumber: "9012345678",
    email: "priya.kapoor@example.com",
    address: "321 Lotus Lane, Bengaluru",
    subject: "Health policy updates",
    applicationMode: "Offline",
    dateOfReceipt: "2026-04-15",
    date: "2026-04-15",
    description: "Want copies of recent health policy updates.",
    department: "Health Department",
    assignedOfficer: "Officer 2",
    dueDate: "2026-04-25",
    extendedDueDate: "2026-04-28",
    reminderFrequency: "Weekly",
    status: "Draft",
  },
  {
    id: 5,
    rtiNo: "RTI-2026-005",
    applicantName: "Sunita Choudhary",
    applicant: "Sunita Choudhary",
    gender: "Female",
    contactNumber: "9876501234",
    email: "sunita.choudhary@example.com",
    address: "22 Pearl Street, Mumbai",
    subject: "Finance committee reports",
    applicationMode: "Online",
    dateOfReceipt: "2026-04-16",
    date: "2026-04-16",
    description: "Requesting finance committee report copies.",
    department: "Finance Department",
    assignedOfficer: "Officer 1",
    dueDate: "2026-04-26",
    extendedDueDate: "2026-04-30",
    reminderFrequency: "Daily",
    status: "Pending",
  },
];

const ensureDataFile = async () => {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await saveApplications(defaultApplications);
  }
};

export const readApplications = async () => {
  await ensureDataFile();
  const fileContents = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(fileContents);
};

export const saveApplications = async (applications) => {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(applications, null, 2), "utf-8");
};
