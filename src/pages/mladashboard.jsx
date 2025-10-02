import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MLADashboard() {
  const [profile, setProfile] = useState(null);
  const [wards, setWards] = useState([]);
  const [wardStats, setWardStats] = useState({});
  const [issues, setIssues] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get MLA profile and wards
      const profileRes = await API.get("/auth/me");
      
      // Get wards assigned to this MLA
      const wardsRes = await API.get("/mla/wards");
      setWards(wardsRes.data);
      
      // Calculate ward statistics
      const stats = {};
      for (const ward of wardsRes.data) {
        // You could add API calls here to get issue statistics per ward
        stats[ward._id] = {
          totalIssues: Math.floor(Math.random() * 50), // Placeholder - replace with real data
          resolvedIssues: Math.floor(Math.random() * 30),
          pendingIssues: Math.floor(Math.random() * 20)
        };
      }
      setWardStats(stats);
      
      setProfile(profileRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fetchWardIssues = async (wardId) => {
    try {
      // This would be an API call to get issues for a specific ward
      // For now, we'll use placeholder data
      const mockIssues = [
        {
          _id: "1",
          description: "Road repair needed on Main Street",
          category: "Roads",
          status: "in-progress",
          user_id: { name: "John Doe" },
          createdAt: new Date().toISOString()
        },
        {
          _id: "2", 
          description: "Water supply issue in Block A",
          category: "Water",
          status: "open",
          user_id: { name: "Jane Smith" },
          createdAt: new Date().toISOString()
        }
      ];
      setIssues(mockIssues);
    } catch (err) {
      console.error("Failed to fetch ward issues:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "reopened": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MLA Dashboard</h1>
              <p className="text-sm text-gray-600">
                Constituency: Punjab | Role: Member of Legislative Assembly
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{wards.length}</div>
            <div className="text-gray-600">Total Wards</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(wardStats).reduce((sum, stat) => sum + (stat.resolvedIssues || 0), 0)}
            </div>
            <div className="text-gray-600">Resolved Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(wardStats).reduce((sum, stat) => sum + (stat.pendingIssues || 0), 0)}
            </div>
            <div className="text-gray-600">Pending Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {wards.filter(w => w.councillor_id).length}
            </div>
            <div className="text-gray-600">Active Councillors</div>
          </div>
        </div>

        {/* Ward Management */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Constituency Wards</h2>
            <p className="text-sm text-gray-600">
              Overview of all wards under your constituency
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Councillor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MC Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wards.map((ward) => (
                  <tr key={ward._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ward.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ward.councillor_id?.name || (
                        <span className="text-red-500">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ward.mc_admin_id?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {wardStats[ward._id]?.totalIssues || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600 font-medium">
                        {wardStats[ward._id]?.resolvedIssues || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedWard(ward._id);
                          fetchWardIssues(ward._id);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Issues
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ward Issues (if selected) */}
        {selectedWard && issues.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ward Issues</h2>
                <p className="text-sm text-gray-600">
                  Issues from {wards.find(w => w._id === selectedWard)?.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedWard("");
                  setIssues([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {issues.map((issue) => (
                    <tr key={issue._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {issue.description.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.user_id?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ward Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ward Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {wards.slice(0, 5).map((ward) => (
                  <div key={ward._id} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{ward.name}</div>
                      <div className="text-sm text-gray-500">
                        Councillor: {ward.councillor_id?.name || "Not assigned"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {wardStats[ward._id]?.resolvedIssues || 0} resolved
                      </div>
                      <div className="text-sm text-gray-500">
                        of {wardStats[ward._id]?.totalIssues || 0} total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New councillor assigned to Ward 5</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">15 issues resolved in Ward 3</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New department created: Sanitation</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Monthly report submitted to government</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">MLA Role Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  As an MLA, you oversee multiple wards across your constituency. You can monitor the performance 
                  of MC Admins and Councillors, track issue resolution rates, and ensure efficient governance 
                  at the local level. Your wards are managed by their respective MC Admins who handle day-to-day operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}