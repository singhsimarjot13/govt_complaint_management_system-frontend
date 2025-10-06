import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
// import HeatmapDistrict from "../components/HeatmapDistrict";
import "../theme/punjab-theme.css";
import PunjabMap from "../assets/Punjab.jpg";

export default function SuperAdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mlas, setMlas] = useState([]);
  const [mcs, setMcs] = useState([]);
  const [editMode, setEditMode] = useState({ type: "", id: null });
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
  const [districts, setDistricts] = useState([]);

  const [mlaForm, setMlaForm] = useState({ name: "", email: "", constituency_location: "", password: "" });
  const [mcForm, setMcForm] = useState({ email: "", city: "", password: "" });

  const navigate = useNavigate();

  // Fetch protected Super Admin data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/super-admin/dashboard");
        setMessage(res.data.message);

        const mlaRes = await API.get("/super-admin/mlas");
        setMlas(mlaRes.data);

        const mcRes = await API.get("/super-admin/mcs");
        setMcs(mcRes.data);
        setDistricts(mcRes.data);
        
        // Fetch analytics data
        await fetchAnalyticsData();
      } catch (err) {
        console.error(err);
        setError("Unauthorized. Please login as Super Admin.");
        navigate("/login");
      }
    };
    fetchDashboard();
  }, [navigate]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch top-level counts
      const statsRes = await API.get('/super-admin/dashboard');

      // Fetch district-level stats (public route)
      const districtsRes = await API.get('/super-admin/district-stats');
      const districtStats = (districtsRes.data?.districts || []).map(d => ({
        district: d.district,
        issues: d.total,
        resolved: d.resolved,
        efficiency: d.total ? Math.round((d.resolved / d.total) * 100) : 0,
      }));

      // Derive departments performance from issues if needed (placeholder empty until endpoint exists)
      const departmentStats = [];

      setAnalyticsData({
        totalIssues: statsRes.data?.totalIssues || 0,
        resolvedIssues: statsRes.data?.resolvedIssues || 0,
        activeWorkers: statsRes.data?.activeWorkers || 0,
        totalDepartments: statsRes.data?.totalDepartments || 0,
        districtStats,
        departmentStats,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setAnalyticsData({ totalIssues: 0, resolvedIssues: 0, activeWorkers: 0, totalDepartments: 0, districtStats: [], departmentStats: [] });
    }
  };

  // Handle Create / Update MLA
  const handleMLASubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editMode.type === "mla") {
        res = await API.put(`/super-admin/update-mla/${editMode.id}`, mlaForm);
      } else {
        res = await API.post("/super-admin/create-mla", mlaForm);
      }
      setSuccess(res.data.message);
      setError("");
      setMlaForm({ name: "", email: "", constituency_location: "", password: "" });
      setEditMode({ type: "", id: null });
      const mlaRes = await API.get("/super-admin/mlas");
      setMlas(mlaRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error in MLA operation");
    }
  };

  // Handle Create / Update MC Admin
  const handleMCSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editMode.type === "mc") {
        res = await API.put(`/super-admin/update-mc/${editMode.id}`, mcForm);
      } else {
        res = await API.post("/super-admin/create-mc", mcForm);
      }
      setSuccess(res.data.message);
      setError("");
      setMcForm({ email: "", city: "", password: "" });
      setEditMode({ type: "", id: null });
      const mcRes = await API.get("/super-admin/mcs");
      setMcs(mcRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error in MC Admin operation");
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold punjab-text-primary">Punjab Govt</h1>
              <p className="text-gray-600">Super Admin Dashboard - Punjab State Civic Portal</p>
            </div>
            <button
              onClick={handleLogout}
              className="punjab-btn-primary bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && <div className="punjab-card p-4 mb-6 bg-blue-50 border-blue-200">{message}</div>}
        {error && <div className="punjab-card p-4 mb-6 bg-red-50 border-red-200 text-red-700">{error}</div>}
        {success && <div className="punjab-card p-4 mb-6 bg-green-50 border-green-200 text-green-700">{success}</div>}

        {/* Tab Navigation */}
        <div className="punjab-card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'management'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Management
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Punjab Image */}
            <div className="punjab-card p-4 mb-8">
              <h2 className="text-2xl font-bold punjab-text-primary mb-4">Punjab District Overview</h2>
              <div className="w-full h-80 md:h-96 lg:h-[28rem] overflow-hidden rounded-2xl bg-white relative">
                <img src={PunjabMap} alt="Punjab Map" className="absolute inset-0 w-full h-full object-contain object-center punjab-zoom-slow" />
              </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="punjab-card p-6 text-center">
                <div className="text-3xl font-bold punjab-text-primary">{analyticsData.totalIssues || 0}</div>
                <div className="text-gray-600">Total Issues</div>
              </div>
              <div className="punjab-card p-6 text-center">
                <div className="text-3xl font-bold punjab-text-accent">{analyticsData.resolvedIssues || 0}</div>
                <div className="text-gray-600">Resolved</div>
              </div>
              <div className="punjab-card p-6 text-center">
                <div className="text-3xl font-bold punjab-text-secondary">{analyticsData.activeWorkers || 0}</div>
                <div className="text-gray-600">Active Workers</div>
              </div>
              <div className="punjab-card p-6 text-center">
                <div className="text-3xl font-bold punjab-text-primary">{analyticsData.totalDepartments || 0}</div>
                <div className="text-gray-600">Departments</div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* District Performance */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">District Performance</h3>
              <div className="space-y-4">
                {analyticsData.districtStats?.map((district, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{district.district}</div>
                      <div className="text-sm text-gray-600">
                        {district.resolved} of {district.issues} resolved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold punjab-text-accent">{district.efficiency}%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Performance */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">Department Performance</h3>
              <div className="space-y-4">
                {analyticsData.departmentStats?.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{dept.department}</div>
                      <div className="text-sm text-gray-600">
                        {dept.resolved} of {dept.issues} resolved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold punjab-text-accent">{dept.efficiency}%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Management Tab */}
        {activeTab === 'management' && (
          <div className="space-y-8">

            {/* Create/Update MLA */}
            <div className="punjab-card p-6">
              <h2 className="text-xl font-semibold punjab-text-primary mb-4">{editMode.type === "mla" ? "Update MLA" : "Create MLA"}</h2>
              <form onSubmit={handleMLASubmit} className="space-y-4">
                <input type="text" placeholder="Name" className="punjab-input w-full"
                  value={mlaForm.name} onChange={(e) => setMlaForm({ ...mlaForm, name: e.target.value })} />
                <input type="email" placeholder="Email" className="punjab-input w-full"
                  value={mlaForm.email} onChange={(e) => setMlaForm({ ...mlaForm, email: e.target.value })} />
                <input type="text" placeholder="Constituency Location" className="punjab-input w-full"
                  value={mlaForm.constituency_location} onChange={(e) => setMlaForm({ ...mlaForm, constituency_location: e.target.value })} />
                <input type="password" placeholder="Password" className="punjab-input w-full"
                  value={mlaForm.password} onChange={(e) => setMlaForm({ ...mlaForm, password: e.target.value })} />
                <button className="punjab-btn-primary">
                  {editMode.type === "mla" ? "Update MLA" : "Create MLA"}
                </button>
              </form>
            </div>

            {/* Create/Update MC Admin */}
            <div className="punjab-card p-6">
              <h2 className="text-xl font-semibold punjab-text-primary mb-4">{editMode.type === "mc" ? "Update MC Admin" : "Create MC Admin"}</h2>
              <form onSubmit={handleMCSubmit} className="space-y-4">
                <input type="email" placeholder="Email" className="punjab-input w-full"
                  value={mcForm.email} onChange={(e) => setMcForm({ ...mcForm, email: e.target.value })} />
                <input type="text" placeholder="City" className="punjab-input w-full"
                  value={mcForm.city} onChange={(e) => setMcForm({ ...mcForm, city: e.target.value })} />
                <input type="password" placeholder="Password" className="punjab-input w-full"
                  value={mcForm.password} onChange={(e) => setMcForm({ ...mcForm, password: e.target.value })} />
                <button className="punjab-btn-secondary">
                  {editMode.type === "mc" ? "Update MC Admin" : "Create MC Admin"}
                </button>
              </form>
            </div>

            {/* MLA List */}
            <div className="punjab-card p-6">
              <h2 className="text-xl font-semibold punjab-text-primary mb-4">MLAs</h2>
              <div className="space-y-3">
                {mlas.map((mla) => (
                  <div key={mla._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{mla.name}</div>
                      <div className="text-sm text-gray-600">{mla.constituency_location}</div>
                    </div>
                    <button
                      className="punjab-btn-secondary text-sm"
                      onClick={() => {
                        setMlaForm({ name: mla.name, email: mla.email, constituency_location: mla.constituency_location, password: "" });
                        setEditMode({ type: "mla", id: mla._id });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* MC Admin List */}
            <div className="punjab-card p-6">
              <h2 className="text-xl font-semibold punjab-text-primary mb-4">MC Admins</h2>
              <div className="space-y-3">
                {mcs.map((mc) => (
                  <div key={mc._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{mc.email}</div>
                      <div className="text-sm text-gray-600">MC Admin — {mc.city}</div>
                    </div>
                    <button
                      className="punjab-btn-secondary text-sm"
                      onClick={() => {
                        setMcForm({ email: mc.email, city: mc.city, password: "" });
                        setEditMode({ type: "mc", id: mc._id });
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
