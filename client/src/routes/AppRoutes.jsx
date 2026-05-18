import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import RTIListPage from "../pages/rti/RTIListPage";
import RTICreateEditPage from "../pages/rti/RTICreateEditPage";
import RTIDetailsPage from "../pages/rti/RTIDetailsPage.jsx";

import ComingSoon from "../pages/placeholders/ComingSoon";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/rti" />} />
          {/* RTI */}
          <Route path="rti" element={<RTIListPage />} />
          <Route path="rti/create" element={<RTICreateEditPage />} />
          <Route path="rti/:id" element={<RTIDetailsPage />} />
          <Route path="rti/edit/:id" element={<RTICreateEditPage isEditMode={true} />} />

          {/* Placeholder Routes */}
          <Route path="dashboard" element={<ComingSoon />} />
          <Route path="legal-cases" element={<ComingSoon />} />
          <Route path="hearings-calendar" element={<ComingSoon />} />
          <Route path="documents" element={<ComingSoon />} />
          <Route path="reports" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/rti" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}