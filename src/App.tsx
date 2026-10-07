import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import Report from "./pages/Report";
import ReportSuccess from "./pages/ReportSuccess";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminReportDetails from "./pages/AdminReportDetails";
import CitizenLayout from "./components/CitizenLayout";
import AdminLayout from "./components/AdminLayout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<CitizenLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report" element={<Report />} />
          <Route path="/report/success" element={<ReportSuccess />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="report/:id" element={<AdminReportDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
