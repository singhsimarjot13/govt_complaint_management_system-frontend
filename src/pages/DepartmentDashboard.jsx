import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DepartmentDashboard() {
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showCreateWorker, setShowCreateWorker] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    photo: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, workersRes] = await Promise.all([
        API.get("/department/issues"),
        API.get("/department/workers")
      ]);
      
      setIssues(issuesRes.data);
      setWorkers(workersRes.data);
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

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      await API.post("/department/workers", newWorker);
      alert("Worker created successfully!");
      setShowCreateWorker(false);
      setNewWorker({
        name: "",
        email: "",
        password: "",
        contact: "",
        photo: ""
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to create worker:", err);
      alert("Failed to create worker");
    }
  };

  const handleAssignWorker = async () => {
    try {
      await API.put(`/department/issues/${selectedIssue._id}/assign`, {
        worker_id: selectedWorker
      });
      alert("Issue assigned to worker!");
      setSelectedIssue(null);
      setSelectedWorker("");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to assign worker:", err);
      alert("Failed to assign worker");
    }
  };

  const handleVerifyCompletion = async (issueId) => {
    try {
      await API.put(`/department/issues/${issueId}/verify`);
      alert("Work completion verified!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to verify completion:", err);
      alert("Failed to verify completion");
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
            <h1 className="text-2xl font-bold text-gray-900">Department Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateWorker(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add Worker
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{issues.length}</div>
            <div className="text-gray-600">Total Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {issues.filter(i => !i.current_worker_id).length}
            </div>
            <div className="text-gray-600">Unassigned</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">
              {issues.filter(i => i.status === "in-progress").length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{workers.length}</div>
            <div className="text-gray-600">Workers</div>
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Department Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward
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
                {issues.map((issue) => (
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
                      {issue.ward_id?.name || "N/A"}
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
                      {!issue.current_worker_id && (
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Assign Worker
                        </button>
                      )}
                      {issue.status === "resolved" && issue.current_worker_id && (
                        <button
                          onClick={() => handleVerifyCompletion(issue._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify Completion
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workers */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Department Workers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Issues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workers.map((worker) => (
                  <tr key={worker._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issues.filter(i => i.current_worker_id?._id === worker._id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Worker Modal */}
      {showCreateWorker && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Worker</h3>
            </div>
            <form onSubmit={handleCreateWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newWorker.email}
                  onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newWorker.password}
                  onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={newWorker.contact}
                  onChange={(e) => setNewWorker({...newWorker, contact: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateWorker(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Worker Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign Worker to Issue</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Issue:</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedIssue.description}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Select Worker</label>
                <select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name} - {worker.contact}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setSelectedWorker("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignWorker}
                  disabled={!selectedWorker}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Assign Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

