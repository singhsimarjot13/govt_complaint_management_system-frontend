import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [wards, setWards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [newIssue, setNewIssue] = useState({
    category: "",
    description: "",
    ward_id: "",
    photos: [],
    gps_coordinates: {}
  });

  const [feedback, setFeedback] = useState({
    rating: 5,
    feedback_description: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch wards first and set immediately (ensures ward dropdowns render ASAP)
      console.log("Fetching wards...");
      const wardsRes = await API.get("/citizen/wards");
      console.log("Wards data:", wardsRes.data);
      setWards(wardsRes.data);

      // Then fetch issues and set immediately
      console.log("Fetching issues...");
      const issuesRes = await API.get("/citizen/issues");
      console.log("Issues data:", issuesRes.data);
      setIssues(issuesRes.data);

      // Finally fetch categories and set
      console.log("Fetching categories...");
      const categoriesRes = await API.get("/citizen/categories");
      console.log("Categories data:", categoriesRes.data);
      setCategories(categoriesRes.data);
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

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      await API.post("/citizen/issues", newIssue);
      setShowCreateForm(false);
      setNewIssue({
        category: "",
        description: "",
        ward_id: "",
        photos: [],
        gps_coordinates: {}
      });
      fetchData(); // Refresh issues
    } catch (err) {
      console.error("Failed to create issue:", err);
      alert("Failed to create issue");
    }
  };

  const handleSubmitFeedback = async (issueId) => {
    try {
      await API.put(`/citizen/issues/${issueId}/feedback`, feedback);
      alert("Feedback submitted successfully!");
      fetchData(); // Refresh issues
      setSelectedIssue(null);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to submit feedback");
    }
  };

  const handleReopenIssue = async (issueId, reason) => {
    try {
      await API.put(`/citizen/issues/${issueId}/reopen`, { reason });
      alert("Issue reopened successfully!");
      fetchData(); // Refresh issues
    } catch (err) {
      console.error("Failed to reopen issue:", err);
      alert("Failed to reopen issue");
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
            <h1 className="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Report Issue
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
              {issues.filter(i => i.status === "open" || i.status === "in-progress").length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter(i => i.status === "resolved").length}
            </div>
            <div className="text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {issues.filter(i => i.status === "reopened").length}
            </div>
            <div className="text-gray-600">Reopened</div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Issues</h2>
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
                    Created
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
                        Ward: {issue.ward_id?.name || "Not assigned"}
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
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {issue.status === "resolved" && !issue.feedback_rating && (
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Give Feedback
                        </button>
                      )}
                      {issue.status === "resolved" && issue.feedback_rating && (
                        <button
                          onClick={() => handleReopenIssue(issue._id, "Not satisfied with resolution")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reopen
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

      {/* Create Issue Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Report New Issue</h3>
            </div>
            <form onSubmit={handleCreateIssue} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ward (Optional)</label>
                <select
                  value={newIssue.ward_id}
                  onChange={(e) => setNewIssue({...newIssue, ward_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Ward (if known)</option>
                  {wards.map((ward) => (
                    <option key={ward._id} value={ward._id}>
                      {ward.ward_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rate & Review</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Rating (1-5 stars)</label>
                <select
                  value={feedback.rating}
                  onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Feedback</label>
                <textarea
                  value={feedback.feedback_description}
                  onChange={(e) => setFeedback({...feedback, feedback_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitFeedback(selectedIssue._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

