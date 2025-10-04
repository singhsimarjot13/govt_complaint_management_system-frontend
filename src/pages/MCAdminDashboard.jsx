import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MCAdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCreateDeptModal, setShowCreateDeptModal] = useState(false);
  const [showCreateCouncillorModal, setShowCreateCouncillorModal] = useState(false);
  const [wards, setWards] = useState([]);
  const [councillors, setCouncillors] = useState([]);
  const navigate = useNavigate();

  const [assignmentData, setAssignmentData] = useState({
    department_id: "",
    notes: ""
  });

  const [transferData, setTransferData] = useState({
    new_department_id: "",
    reason: "",
    notes: ""
  });

  const [createDeptData, setCreateDeptData] = useState({
    name: "",
    admin_email: "",
    admin_password: ""
  });

  const [createCouncillorData, setCreateCouncillorData] = useState({
    name: "",
    email: "",
    ward_id: "",
    password: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const issuesRes = await API.get("/mc-admin/issues");
      setIssues(issuesRes.data);
  
      // Fetch departments next
      const departmentsRes = await API.get("/mc-admin/departments");
      setDepartments(departmentsRes.data);

      // Fetch wards
      const wardsRes = await API.get("/mc-admin/wards");
      setWards(wardsRes.data);

      // Fetch councillors
      const councillorsRes = await API.get("/mc-admin/councillors");
      setCouncillors(councillorsRes.data);

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

  const handleAssignToDepartment = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/mc-admin/issues/${selectedIssue._id}/assign`, assignmentData);
      setShowAssignModal(false);
      setAssignmentData({ department_id: "", notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue assigned to department successfully!");
    } catch (err) {
      console.error("Failed to assign issue:", err);
      alert("Failed to assign issue to department");
    }
  };

  const handleTransferToDepartment = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/mc-admin/issues/${selectedIssue._id}/transfer`, transferData);
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

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mc-admin/departments", createDeptData);
      setShowCreateDeptModal(false);
      setCreateDeptData({ name: "", admin_email: "", admin_password: "" });
      fetchData();
      alert("Department created successfully!");
    } catch (err) {
      console.error("Failed to create department:", err);
      alert("Failed to create department");
    }
  };

  const handleCreateCouncillor = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mc-admin/councillors", createCouncillorData);
      setShowCreateCouncillorModal(false);
      setCreateCouncillorData({ name: "", email: "", ward_id: "", password: "" });
      fetchData();
      alert("Councillor created successfully!");
    } catch (err) {
      console.error("Failed to create councillor:", err);
      alert("Failed to create councillor");
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
            <h1 className="text-2xl font-bold text-gray-900">MC Admin Dashboard</h1>
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
              {issues.filter(i => i.status === "verified_by_councillor").length}
            </div>
            <div className="text-gray-600">Ready for Assignment</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {issues.filter(i => i.status === "assigned_to_department").length}
            </div>
            <div className="text-gray-600">Assigned to Departments</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter(i => ["verified_resolved", "resolved"].includes(i.status)).length}
            </div>
            <div className="text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Management</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Department Management</h3>
                <p className="text-blue-700 mb-4">Create and manage departments for issue resolution</p>
                <button
                  onClick={() => setShowCreateDeptModal(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Department
                </button>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-900 mb-2">Councillor Management</h3>
                <p className="text-green-700 mb-4">Create and manage councillors for ward representation</p>
                <button
                  onClick={() => setShowCreateCouncillorModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Create Councillor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Issues</h2>
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
                    Department
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
                      {issue.current_department_id?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.current_worker_id?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        {["verified_by_councillor", "reopened"].includes(issue.status) && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowAssignModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Assign Department
                          </button>
                        )}
                        {["assigned_to_department", "in-progress", "resolved_by_worker"].includes(issue.status) && (
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
                        {!["verified_by_councillor", "reopened", "assigned_to_department", "in-progress", "resolved_by_worker"].includes(issue.status) && (
                          <span className="text-gray-500 text-sm">No Actions Available</span>
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

      {/* Assign Department Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign to Department</h3>
            </div>
            <form onSubmit={handleAssignToDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Select Department</label>
                <select
                  value={assignmentData.department_id}
                  onChange={(e) => setAssignmentData({...assignmentData, department_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
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
                  Assign Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Department Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transfer to Department</h3>
            </div>
            <form onSubmit={handleTransferToDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">New Department</label>
                <select
                  value={transferData.new_department_id}
                  onChange={(e) => setTransferData({...transferData, new_department_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
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
                  placeholder="Reason for transfer..."
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={transferData.notes}
                  onChange={(e) => setTransferData({...transferData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Add transfer notes..."
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

      {/* Create Department Modal */}
      {showCreateDeptModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Department</h3>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Department Name</label>
                <select
    value={createDeptData.name}
    onChange={(e) =>
      setCreateDeptData({ ...createDeptData, name: e.target.value })
    }
    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    required
  >
    <option value="">Select department</option>
    <option value="Roads">Roads</option>
    <option value="Sewerage">Sewerage</option>
    <option value="Water">Water</option>
    <option value="Electricity">Electricity</option>
    <option value="Other">Other</option>
  </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={createDeptData.admin_email}
                  onChange={(e) => setCreateDeptData({...createDeptData, admin_email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter admin email..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  value={createDeptData.admin_password}
                  onChange={(e) => setCreateDeptData({...createDeptData, admin_password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter admin password..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateDeptModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Councillor Modal */}
      {showCreateCouncillorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Councillor</h3>
            </div>
            <form onSubmit={handleCreateCouncillor} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Councillor Name</label>
                <input
                  type="text"
                  value={createCouncillorData.name}
                  onChange={(e) => setCreateCouncillorData({...createCouncillorData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter councillor name..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={createCouncillorData.email}
                  onChange={(e) => setCreateCouncillorData({...createCouncillorData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter email..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ward</label>
                <select
                  value={createCouncillorData.ward_id}
                  onChange={(e) => setCreateCouncillorData({...createCouncillorData, ward_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward._id} value={ward._id}>
                      {ward.ward_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={createCouncillorData.password}
                  onChange={(e) => setCreateCouncillorData({...createCouncillorData, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter password..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCouncillorModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create Councillor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
