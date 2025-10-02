import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MCAdminDashboard() {
  const [councillors, setCouncillors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  const [issues, setIssues] = useState([]);
  const [showCreateCouncillor, setShowCreateCouncillor] = useState(false);
  const [showCreateDepartment, setShowCreateDepartment] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newCouncillor, setNewCouncillor] = useState({
    name: "",
    email: "",
    password: "",
    ward_id: ""
  });

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    admin_email: "",
    admin_password: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Debug useEffect to track wards state changes
  useEffect(() => {
    console.log("Wards state changed:", wards);
    console.log("Wards length:", wards?.length);
  }, [wards]);
  useEffect(() => {
    console.log("Councillors state changed:", councillors);
    console.log("Councillors length:", councillors?.length);
  }, [councillors]);
  useEffect(() => {
    console.log("Departments state changed:", departments);
    console.log("Departments length:", departments?.length);
  }, [departments]);
  useEffect(() => {
    console.log("Issues state changed:", issues);
    console.log("Issues length:", issues?.length);
  }, [issues]);

  const fetchData = async () => {
    try {
      // Fetch wards separately first
      console.log("Fetching wards...");
      const wardsResponse = await API.get("/mc-admin/wards");
      console.log("Raw wards response:", wardsResponse);
      console.log("Wards data:", wardsResponse.data);
      
      // Set wards immediately
      setWards(wardsResponse.data);
      console.log("Wards set, should trigger re-render");

      // Fetch councillors separately and set immediately (like wards)
      console.log("Fetching councillors...");
      const councillorsRes = await API.get("/mc-admin/councillors");
      console.log("Raw councillors response:", councillorsRes);
      console.log("Councillors data:", councillorsRes.data);
      setCouncillors(councillorsRes.data);
      console.log("Councillors set, should trigger re-render");

      // Fetch departments separately and set immediately (like wards)
      console.log("Fetching departments...");
      const departmentsRes = await API.get("/mc-admin/departments");
      console.log("Raw departments response:", departmentsRes);
      console.log("Departments data:", departmentsRes.data);
      setDepartments(departmentsRes.data);
      console.log("Departments set, should trigger re-render");

      // Fetch issues last
      console.log("Fetching issues...");
      const issuesRes = await API.get("/mc-admin/issues");
      console.log("Raw issues response:", issuesRes);
      console.log("Issues data:", issuesRes.data);
      setIssues(issuesRes.data);
      
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


  const handleCreateCouncillor = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mc-admin/councillors", newCouncillor);
      alert("Councillor created successfully!");
      setShowCreateCouncillor(false);
      setNewCouncillor({
        name: "",
        email: "",
        password: "",
        ward_id: ""
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to create councillor:", err);
      alert("Failed to create councillor");
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mc-admin/departments", newDepartment);
      alert("Department created successfully!");
      setShowCreateDepartment(false);
      setNewDepartment({
        name: "",
        admin_email: "",
        admin_password: ""
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to create department:", err);
      alert("Failed to create department");
    }
  };

  const handleAssignIssueToDepartment = async () => {
    try {
      await API.put(`/mc-admin/issues/${selectedIssue._id}/assign`, {
        department_id: selectedDepartment
      });
      alert("Issue assigned to department!");
      setSelectedIssue(null);
      setSelectedDepartment("");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to assign issue:", err);
      alert("Failed to assign issue");
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
            <h1 className="text-2xl font-bold text-gray-900">MC Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateCouncillor(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Councillor
              </button>
              <button
                onClick={() => setShowCreateDepartment(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Create Department
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
            <div className="text-2xl font-bold text-blue-600">{wards.length}</div>
            <div className="text-gray-600">Total Wards</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{councillors.length}</div>
            <div className="text-gray-600">Councillors</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{departments.length}</div>
            <div className="text-gray-600">Departments</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{issues.length}</div>
            <div className="text-gray-600">Pending Issues</div>
          </div>
        </div>

        {/* Issues Needing Department Assignment */}
        {issues.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Issues Needing Department Assignment
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
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
                          By: {issue.user_id?.name} | {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.ward_id?.ward_name || "Not assigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Assign Department
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Councillors */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Councillors</h2>
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
                    Ward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {councillors.map((councillor) => (
                  <tr key={councillor._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {councillor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {councillor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {councillor.ward_id?.ward_name || "Not assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(councillor.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* Departments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
        </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.admin_id?.name} ({department.admin_id?.email})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(department.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Councillor Modal */}
      {showCreateCouncillor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Councillor</h3>
            </div>
            <form onSubmit={handleCreateCouncillor} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCouncillor.name}
                  onChange={(e) => setNewCouncillor({...newCouncillor, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newCouncillor.email}
                  onChange={(e) => setNewCouncillor({...newCouncillor, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newCouncillor.password}
                  onChange={(e) => setNewCouncillor({...newCouncillor, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ward</label>
                {console.log("Current wards state in render:", wards)}
                {console.log("Wards length in render:", wards?.length)}
                <select
  value={newCouncillor.ward_id}
  onChange={(e) =>
    setNewCouncillor({ ...newCouncillor, ward_id: e.target.value })
  }
  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
  required
>
  <option value="">Select Ward</option>
  {wards && Array.isArray(wards) && wards.length > 0
  ? wards.map((ward) => {
      console.log("Mapping ward:", ward); // 👀 yahan dekhna
      return (
        <option key={ward._id} value={ward._id}>
          {ward.ward_name}
        </option>
      );
    })
  : <option disabled>No Wards Available (Length: {wards?.length || 0})</option>}
</select>





              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCouncillor(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Councillor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Department Modal */}
      {showCreateDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create Department</h3>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Department Name</label>
                <select
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Department Type</option>
                  <option value="Roads">Roads</option>
                  <option value="Sewerage">Sewerage</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Department Admin Email</label>
                <input
                  type="email"
                  value={newDepartment.admin_email}
                  onChange={(e) => setNewDepartment({...newDepartment, admin_email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  value={newDepartment.admin_password}
                  onChange={(e) => setNewDepartment({...newDepartment, admin_password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  minLength={6}
                />
      </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateDepartment(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Issue to Department Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign Issue to Department</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Issue Details:</h4>
                <p className="text-sm text-gray-600 mb-4">{selectedIssue.description}</p>
                <p className="text-sm text-gray-500">Category: {selectedIssue.category}</p>
        </div>

              <div>
                <label className="block text-gray-700 mb-1">Assign to Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name} - {department.admin_id?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setSelectedDepartment("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignIssueToDepartment}
                  disabled={!selectedDepartment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Assign to Department
                </button>
              </div>
            </div>
      </div>
        </div>
      )}
    </div>
  );
}