import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function WorkerDashboard() {
  const [issues, setIssues] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [workPhotos, setWorkPhotos] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, profileRes] = await Promise.all([
        API.get("/worker/issues"),
        API.get("/worker/profile")
      ]);
      
      setIssues(issuesRes.data);
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

  const handleUpdateStatus = async (issueId, status) => {
    try {
      await API.put(`/worker/issues/${issueId}/status`, { status });
      alert("Status updated successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  const handleMarkWorkDone = async () => {
    try {
      await API.put(`/worker/issues/${selectedIssue._id}/complete`, {
        work_photos: workPhotos,
        notes: notes
      });
      alert("Work marked as completed!");
      setSelectedIssue(null);
      setWorkPhotos([]);
      setNotes("");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to mark work as done:", err);
      alert("Failed to mark work as done");
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
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
              <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-sm text-gray-600">
                {profile?.name} - {profile?.department_id?.name} Department
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{issues.length}</div>
            <div className="text-gray-600">Total Assigned</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {issues.filter(i => i.status === "in-progress").length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter(i => i.status === "resolved").length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {issues.filter(i => i.priority === "High").length}
            </div>
            <div className="text-gray-600">High Priority</div>
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Assigned Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      <div className="text-sm text-gray-500">
                        Category: {issue.category} | Reported: {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        By: {issue.user_id?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Ward: {issue.ward_id?.name || "N/A"}
                      </div>
                      {issue.gps_coordinates?.latitude && (
                        <div className="text-sm text-gray-500">
                          GPS: {issue.gps_coordinates.latitude.toFixed(4)}, {issue.gps_coordinates.longitude.toFixed(4)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {issue.status === "open" && (
                        <button
                          onClick={() => handleUpdateStatus(issue._id, "in-progress")}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Start Work
                        </button>
                      )}
                      {issue.status === "in-progress" && (
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Complete
                        </button>
                      )}
                      {issue.photos && issue.photos.length > 0 && (
                        <button
                          onClick={() => {
                            // View photos functionality
                            window.open(issue.photos[0], '_blank');
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View Photos
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {issues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No issues assigned yet</div>
          </div>
        )}
      </div>

      {/* Mark Work Complete Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mark Work as Complete</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Issue:</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedIssue.description}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Work Completion Photos (URLs)</label>
                <textarea
                  value={workPhotos.join('\n')}
                  onChange={(e) => setWorkPhotos(e.target.value.split('\n').filter(url => url.trim()))}
                  placeholder="Enter photo URLs, one per line..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload photos to Cloudinary and paste URLs here
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Work Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe the work completed..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setWorkPhotos([]);
                    setNotes("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkWorkDone}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

