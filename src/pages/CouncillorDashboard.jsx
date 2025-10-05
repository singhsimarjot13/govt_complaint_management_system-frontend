import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../theme/punjab-theme.css";

export default function CouncillorDashboard() {
  const [wardIssues, setWardIssues] = useState([]);
  const [unassignedIssues, setUnassignedIssues] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const navigate = useNavigate();

  const [verificationData, setVerificationData] = useState({
    ward_id: "",
    notes: ""
  });

  const [resolutionData, setResolutionData] = useState({
    notes: ""
  });

  const [priorityData, setPriorityData] = useState({
    priority: "Medium"
  });

  const [forwardData, setForwardData] = useState({
    priority: "Medium",
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
  
    // Fetch ward issues
    try {
      const wardIssuesRes = await API.get("/councillor/ward-issues");
      setWardIssues(wardIssuesRes.data);
    } catch (err) {
      console.error("Failed to fetch ward issues:", err);
    }
  
    // Fetch unassigned issues
    try {
      const unassignedIssuesRes = await API.get("/councillor/unassigned-issues");
      setUnassignedIssues(unassignedIssuesRes.data);
    } catch (err) {
      console.error("Failed to fetch unassigned issues:", err);
    }
  
    // Fetch wards list
    try {
      const wardsRes = await API.get("/councillor/wards");
      setWards(wardsRes.data);
      const councillor = wardsRes.data;
      setVerificationData({
        ward_id: councillor.ward_id || { ward_name: "" },
        notes: "",
      });
    } catch (err) {
      console.error("Failed to fetch wards:", err);
    }
  
    setLoading(false);
  };
  

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleVerifyIssue = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/councillor/issues/${selectedIssue._id}/verify`, verificationData);
      setShowVerifyModal(false);
      setVerificationData({  ward_id: { ward_name: "" }, notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue verified successfully!");
    } catch (err) {
      console.error("Failed to verify issue:", err);
      alert("Failed to verify issue");
    }
  };

  const handleMarkResolved = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/councillor/issues/${selectedIssue._id}/resolve`, resolutionData);
      setShowResolveModal(false);
      
      setResolutionData({ notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue marked as resolved!");
    } catch (err) {
      console.error("Failed to mark issue as resolved:", err);
      alert("Failed to mark issue as resolved");
    }
  };

  const handleSetPriority = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/councillor/issues/${selectedIssue._id}/priority`, priorityData);
      setShowPriorityModal(false);
      setPriorityData({ priority: "Medium" });
      setSelectedIssue(null);
      fetchData();
      alert("Priority updated successfully!");
    } catch (err) {
      console.error("Failed to update priority:", err);
      alert("Failed to update priority");
    }
  };

  const handleForwardToMCAdmin = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/councillor/issues/${selectedIssue._id}/forward`, forwardData);
      setShowForwardModal(false);
      setForwardData({ priority: "Medium", notes: "" });
      setSelectedIssue(null);
      fetchData();
      alert("Issue forwarded to MC Admin successfully!");
    } catch (err) {
      console.error("Failed to forward issue:", err);
      alert("Failed to forward issue");
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "priority-critical";
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      case "Low": return "priority-low";
      default: return "priority-medium";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Critical": return "🔴";
      case "High": return "🟠";
      case "Medium": return "🟡";
      case "Low": return "🟢";
      default: return "🟡";
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
              <h1 className="text-2xl font-bold punjab-text-primary">Councillor Dashboard</h1>
              <p className="text-gray-600">Ward-level civic issue verification and management</p>
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
              {wardIssues.filter(i => i.status === "verified_resolved").length}
            </div>
            <div className="text-gray-600">Ready for Final Verification</div>
          </div>
        </div>

        {/* Ward Issues */}
        <div className="punjab-card mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ward Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wardIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.description.substring(0, 50)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        Ward: {issue.ward_id?.ward_name || "Not assigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                        <span className="mr-1">{getPriorityIcon(issue.priority)}</span>
                        {issue.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {getStatusText(issue.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {issue.status === "open" && (
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setVerificationData({
                              ward_id: issue.ward_id || { ward_name: "" },
                              notes: ""
                            });
                        
                            setShowVerifyModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Verify
                        </button>
                      )}
                      {issue.status === "department_resolved" && (
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowResolveModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          Final Verify
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowPriorityModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 mr-2"
                      >
                        Set Priority
                      </button>
                      {issue.status === "verified_by_councillor" && (
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowForwardModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Forward to MC Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unassigned Issues */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Unassigned Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unassignedIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.description.substring(0, 50)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        Ward: Not assigned
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {getStatusText(issue.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {issue.status === "open" && (
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowVerifyModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Verify & Assign Ward
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

      {/* Verify Issue Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Verify Issue</h3>
            </div>
            <form onSubmit={handleVerifyIssue} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Assign Ward</label>
                <div>
    
  <input
    type="text"
    value={verificationData.ward_id?.ward_name}
    readOnly
    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
  />
</div>

              </div>

              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Verify Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Final Verification Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Final Verification</h3>
            </div>
            <form onSubmit={handleMarkResolved} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Verification Notes</label>
                <textarea
                  value={resolutionData.notes}
                  onChange={(e) => setResolutionData({...resolutionData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Add final verification notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Priority Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Set Priority</h3>
            </div>
            <form onSubmit={handleSetPriority} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Priority Level</label>
                <select
                  value={priorityData.priority}
                  onChange={(e) => setPriorityData({...priorityData, priority: e.target.value})}
                  className="punjab-select w-full"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPriorityModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="punjab-btn-primary"
                >
                  Set Priority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forward to MC Admin Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Forward to MC Admin</h3>
            </div>
            <form onSubmit={handleForwardToMCAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Priority Level</label>
                <select
                  value={forwardData.priority}
                  onChange={(e) => setForwardData({...forwardData, priority: e.target.value})}
                  className="punjab-select w-full"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  value={forwardData.notes}
                  onChange={(e) => setForwardData({...forwardData, notes: e.target.value})}
                  className="punjab-input w-full"
                  rows="3"
                  placeholder="Add forwarding notes..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="punjab-btn-primary"
                >
                  Forward Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}