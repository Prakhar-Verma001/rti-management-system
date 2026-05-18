import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple in-flight request deduplication to avoid duplicate network calls
const inFlightRequests = new Map();

function sanitizePayload(payload) {
  // Remove File objects (from file inputs) before sending JSON payload.
  const copy = { ...payload };
  if (copy.uploadApplication && typeof copy.uploadApplication !== "string") {
    // replace with empty string or filename placeholder
    copy.uploadApplication = "";
  }
  if (copy.additionalAttachments && !Array.isArray(copy.additionalAttachments)) {
    // If it's a FileList or single file, normalize to empty array
    copy.additionalAttachments = Array.isArray(copy.additionalAttachments)
      ? copy.additionalAttachments.map((f) => (typeof f === "string" ? f : ""))
      : [];
  }
  return copy;
}

function getErrorMessage(error) {
  const serverMsg = error?.response?.data;
  if (serverMsg) {
    if (serverMsg.errors && Array.isArray(serverMsg.errors)) {
      const combined = serverMsg.errors.map((e) => `${e.field}: ${e.message}`).join("; ");
      return `${serverMsg.message || "Server error"} - ${combined}`;
    }
    return serverMsg.message || error?.message || "Server error";
  }
  return error?.message || "Unable to communicate with the server";
}

export async function getRTIApplications({
  page = 1,
  pageSize = 10,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  department = "",
} = {}) {
  try {
    const key = `getRTIApplications:${page}:${pageSize}:${search}:${startDate}:${endDate}:${status}:${department}`;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const promise = apiClient
      .get("/rti", { params: { page, pageSize, search, startDate, endDate, status, department } })
      .then((res) => res.data)
      .finally(() => inFlightRequests.delete(key));

    inFlightRequests.set(key, promise);
    return promise;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getRTIApplicationById(id) {
  try {
    const key = `getRTIApplicationById:${id}`;
    if (inFlightRequests.has(key)) return inFlightRequests.get(key);

    const promise = apiClient.get(`/rti/${id}`).then((res) => res.data).finally(() => inFlightRequests.delete(key));
    inFlightRequests.set(key, promise);
    return promise;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createRTIApplication(data) {
  try {
    const response = await apiClient.post("/rti", sanitizePayload(data));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRTIApplication(id, data) {
  try {
    const response = await apiClient.put(`/rti/${id}`, sanitizePayload(data));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteRTIApplication(id) {
  try {
    const response = await apiClient.delete(`/rti/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
