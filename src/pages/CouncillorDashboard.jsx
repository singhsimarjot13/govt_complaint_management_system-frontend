import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CouncillorDashboard() {
  const [wardIssues, setWardIssues] = useState([]);
  const [unassignedIssues, setUnassignedIssues] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedWard, setSelectedWard] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wardIssuesRes, unassignedRes, wardsRes] = await Promise.all([
        API.get("/councillor/ward-issues"),
        API.get("/councillor/unassigned-issues"),
        API.get("/mc-admin/wards") // Get all wards for assignment
      ]);
      
      setWardIssues(wardIssuesRes.data);
      setUnassignedIssues(unassignedRes.data);
      setWards(wardsRes.data);
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

  const handleVerifyIssue = async (issueId, wardId) => {
    try {
      await API.put(`/councillor/issues/${issueId}/verify`, { ward_id: wardId });
      alert("Issue verified and assigned to ward!");
      fetchData(); // Refresh data
      setSelectedIssue(null);
    } catch (err) {
      console.error("Failed to verify issue:", err);
      alert("Failed to verify issue");
    }
  };

  const handleForwardToMC = async (issueId) => {
    try {
      await API.put(`/councillor/issues/${issueId}/forward`);
      alert("Issue forwarded to MC Admin!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to forward issue:", err);
      alert("Failed to forward issue");
    }
  };

  const handleMarkResolved = async (issueId) => {
    try {
      await API.put(`/councillor/issues/${issueId}/resolve`);
      alert("Issue marked as resolved!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to mark as resolved:", err);
      alert("Failed to mark as resolved");
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
            <h1 className="text-2xl font-bold text-gray-900">Councillor Dashboard</h1>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{wardIssues.length}</div>
            <div className="text-gray-600">Ward Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{unassignedIssues.length}</div>
            <div className="text-gray-600">Unassigned Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {wardIssues.filter(i => i.status === "resolved").length}
            </div>
            <div className="text-gray-600">Resolved Issues</div>
          </div>
        </div>

        {/* Unassigned Issues */}
        {unassignedIssues.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Unassigned Issues (Need Ward Assignment)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Citizen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unassignedIssues.map((issue) => (
                    <tr key={issue._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {issue.description.substring(0, 100)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.user_id?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign Ward
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ward Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Ward Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wardIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.description.substring(0, 100)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        By: {issue.user_id?.name} | {new Date(issue.createdAt).toLocaleDateString()}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.current_worker_id?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {issue.status === "open" && (
                        <button
                          onClick={() => handleForwardToMC(issue._id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Forward to MC
                        </button>
                      )}
                      {issue.status === "resolved" && issue.current_worker_id && (
                        <button
                          onClick={() => handleMarkResolved(issue._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify & Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ward Assignment Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign Ward to Issue</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Issue Details:</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedIssue.description}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Select Ward</label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward._id} value={ward._id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setSelectedWard("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyIssue(selectedIssue._id, selectedWard)}
                  disabled={!selectedWard}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Verify & Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

