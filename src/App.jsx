import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import AboutPunjab from "./pages/AboutPunjab";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import MCAdminDashboard from "./pages/MCAdminDashboard";
import MLADashboard from "./pages/mladashboard";
import CouncillorDashboard from "./pages/CouncillorDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import API from "./services/api"; // Axios instance

// Role-based private route
const PrivateRoute = ({ element: Element, allowedRoles }) => {
  const [isAuth, setIsAuth] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me"); // returns { success: true, role: "Super_Admin" }
        setUserRole(res.data.role);
        setIsAuth(allowedRoles.includes(res.data.role));
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  if (isAuth === null)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );

  return isAuth ? <Element /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about-punjab" element={<AboutPunjab />} />

          <Route
            path="/super-admin/dashboard"
            element={<PrivateRoute element={SuperAdminDashboard} allowedRoles={["super_admin"]} />}
          />
          <Route
            path="/mc-admin/dashboard"
            element={<PrivateRoute element={MCAdminDashboard} allowedRoles={["mc_admin"]} />}
          />
          <Route
            path="/mla/dashboard"
            element={<PrivateRoute element={MLADashboard} allowedRoles={["mla"]} />}
          />
          <Route
            path="/councillor/dashboard"
            element={<PrivateRoute element={CouncillorDashboard} allowedRoles={["councillor"]} />}
          />
          <Route
            path="/department/dashboard"
            element={<PrivateRoute element={DepartmentDashboard} allowedRoles={["department_admin"]} />}
          />
          <Route
            path="/worker/dashboard"
            element={<PrivateRoute element={WorkerDashboard} allowedRoles={["worker"]} />}
          />
          <Route
            path="/citizen/dashboard"
            element={<PrivateRoute element={CitizenDashboard} allowedRoles={["citizen"]} />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
