import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DepartmentDashboard() {
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCreateWorkerModal, setShowCreateWorkerModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showChangeWorkerModal, setShowChangeWorkerModal] = useState(false);
  const navigate = useNavigate();

  const [assignmentData, setAssignmentData] = useState({
    worker_id: "",
    notes: ""
  });

  const [verificationData, setVerificationData] = useState({
    notes: ""
  });

  const [transferData, setTransferData] = useState({
    new_department_id: "",
    reason: "",
    notes: ""
  });

  const [changeWorkerData, setChangeWorkerData] = useState({
    new_worker_id: "",
    notes: ""
  });

  const [createWorkerData, setCreateWorkerData] = useState({
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
      const issuesRes = await API.get("/department/issues");
      setIssues(issuesRes.data);

      const workersRes = await API.get("/department/workers");
      setWorkers(workersRes.data);

      const departmentsRes = await API.get("/department/departments");
      setDepartments(departmentsRes.data);

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

  const handleAssignToWorker = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/department/issues/${selectedIssue._id}/assign`, assignmentData);
      setShowAssignModal(false);
      setAssignmentData({ worker_id: "", notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue assigned to worker successfully!");
    } catch (err) {
      console.error("Failed to assign issue:", err);
      alert("Failed to assign issue to worker");
    }
  };

  const handleVerifyWorkCompletion = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/department/issues/${selectedIssue._id}/verify`, verificationData);
      setShowVerifyModal(false);
      setVerificationData({ notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Work completion verified successfully!");
    } catch (err) {
      console.error("Failed to verify work:", err);
      alert("Failed to verify work completion");
    }
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      await API.post("/department/workers", createWorkerData);
      setShowCreateWorkerModal(false);
      setCreateWorkerData({ name: "", email: "", password: "", contact: "" });
      fetchData();
      alert("Worker created successfully!");
    } catch (err) {
      console.error("Failed to create worker:", err);
      alert("Failed to create worker");
    }
  };

  const handleTransferIssue = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/department/issues/${selectedIssue._id}/transfer`, transferData);
      setShowTransferModal(false);
      setTransferData({ new_department_id: "", reason: "", notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue transferred successfully!");
    } catch (err) {
      console.error("Failed to transfer issue:", err);
      alert("Failed to transfer issue");
    }
  };

  const handleChangeWorker = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/department/issues/${selectedIssue._id}/change-worker`, changeWorkerData);
      setShowChangeWorkerModal(false);
      setChangeWorkerData({ new_worker_id: "", notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Worker changed successfully!");
    } catch (err) {
      console.error("Failed to change worker:", err);
      alert("Failed to change worker");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-yellow-100 text-yellow-800";
      case "verified_by_councillor": return "bg-blue-100 text-blue-800";
      case "assigned_to_department": return "bg-purple-100 text-purple-800";
      case "in-progress": return "bg-orange-100 text-orange-800";
      case "resolved_by_worker": return "bg-indigo-100 text-indigo-800";
      case "department_resolved": return "bg-teal-100 text-teal-800";
      case "verified_resolved": return "bg-green-100 text-green-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "reopened": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open": return "Open";
      case "verified_by_councillor": return "Verified by Councillor";
      case "assigned_to_department": return "Assigned to Department";
      case "in-progress": return "Work in Progress";
      case "resolved_by_worker": return "Work Completed";
      case "department_resolved": return "Department Verified";
      case "verified_resolved": return "Ready for Feedback";
      case "resolved": return "Resolved";
      case "reopened": return "Reopened";
      default: return status;
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
            <h1 className="text-2xl font-bold text-gray-900">Department Dashboard</h1>
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
            <div className="text-gray-600">Total Issues</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {issues.filter(i => i.status === "assigned_to_department").length}
            </div>
            <div className="text-gray-600">Ready for Worker Assignment</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">
              {issues.filter(i => i.status === "in-progress").length}
            </div>
            <div className="text-gray-600">Work in Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-indigo-600">
              {issues.filter(i => i.status === "resolved_by_worker").length}
            </div>
            <div className="text-gray-600">Ready for Verification</div>
          </div>
        </div>

        {/* Worker Management Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Worker Management</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Workers</h3>
                <p className="text-gray-600">Create and manage workers for issue resolution</p>
              </div>
              <button
                onClick={() => setShowCreateWorkerModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Worker
              </button>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow">
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
                    Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.description.substring(0, 50)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        By: {issue.user_id?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.ward_id?.ward_name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {getStatusText(issue.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.current_worker_id?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        {issue.status === "assigned_to_department" && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowAssignModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Assign Worker
                          </button>
                        )}
                        {issue.status === "resolved_by_worker" && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowVerifyModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Verify Work
                          </button>
                        )}
                        {["assigned_to_department", "in-progress"].includes(issue.status) && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowTransferModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Transfer
                          </button>
                        )}
                        {["assigned_to_department", "in-progress"].includes(issue.status) && issue.current_worker_id && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowChangeWorkerModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Change Worker
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Worker Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign to Worker</h3>
            </div>
            <form onSubmit={handleAssignToWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Select Worker</label>
                <select
                  value={assignmentData.worker_id}
                  onChange={(e) => setAssignmentData({...assignmentData, worker_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name} - {worker.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={assignmentData.notes}
                  onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Add assignment notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Assign Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Work Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Verify Work Completion</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Worker Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Worker Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolved By Worker</label>
                    <p className="text-sm text-gray-900">{selectedIssue.current_worker_id?.name || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolved At</label>
                    <p className="text-sm text-gray-900">
                      {selectedIssue.resolved_by_worker_at 
                        ? new Date(selectedIssue.resolved_by_worker_at).toLocaleString()
                        : "Not specified"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Worker Notes */}
              {selectedIssue.worker_notes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Worker Notes</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedIssue.worker_notes}</p>
                  </div>
                </div>
              )}

              {/* Worker Photos */}
              {selectedIssue.worker_photos && selectedIssue.worker_photos.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Work Completion Photos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedIssue.worker_photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Work completion photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Photo {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleVerifyWorkCompletion} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Verification Notes</label>
                  <textarea
                    value={verificationData.notes}
                    onChange={(e) => setVerificationData({...verificationData, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="3"
                    placeholder="Add verification notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Verify Work
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Worker Modal */}
      {showCreateWorkerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Worker</h3>
            </div>
            <form onSubmit={handleCreateWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Worker Name</label>
                <input
                  type="text"
                  value={createWorkerData.name}
                  onChange={(e) => setCreateWorkerData({...createWorkerData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter worker name..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={createWorkerData.email}
                  onChange={(e) => setCreateWorkerData({...createWorkerData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter email..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={createWorkerData.password}
                  onChange={(e) => setCreateWorkerData({...createWorkerData, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter password..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={createWorkerData.contact}
                  onChange={(e) => setCreateWorkerData({...createWorkerData, contact: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter contact number..."
                  required
                />
              </div>


              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkerModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Issue Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transfer Issue</h3>
            </div>
            <form onSubmit={handleTransferIssue} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Transfer to Department</label>
                <select
                  value={transferData.new_department_id}
                  onChange={(e) => setTransferData({...transferData, new_department_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} - {dept.admin_id?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Reason for Transfer</label>
                <input
                  type="text"
                  value={transferData.reason}
                  onChange={(e) => setTransferData({...transferData, reason: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter reason for transfer..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={transferData.notes}
                  onChange={(e) => setTransferData({...transferData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Transfer Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Worker Modal */}
      {showChangeWorkerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Change Worker</h3>
            </div>
            <form onSubmit={handleChangeWorker} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Current Worker</label>
                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                  {selectedIssue.current_worker_id?.name || "Not assigned"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Select New Worker</label>
                <select
                  value={changeWorkerData.new_worker_id}
                  onChange={(e) => setChangeWorkerData({...changeWorkerData, new_worker_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select New Worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name} - {worker.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={changeWorkerData.notes}
                  onChange={(e) => setChangeWorkerData({...changeWorkerData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Add notes about the worker change..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChangeWorkerModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Change Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}