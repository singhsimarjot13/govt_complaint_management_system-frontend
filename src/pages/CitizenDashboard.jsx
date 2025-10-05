import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import "../theme/punjab-theme.css";

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [wards, setWards] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-issues');
  const [reopenDisabled, setReopenDisabled] = useState({});
  const [reopenCountdown, setReopenCountdown] = useState({});
  const [citizenLeaderboard, setCitizenLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [wardsLeaderboard, setWardsLeaderboard] = useState([]);
  const navigate = useNavigate();

  const [newIssue, setNewIssue] = useState({
    category: "",
    description: "",
    city: "",
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
      // Fetch cities first
      console.log("Fetching cities...");
      const citiesRes = await API.get("/citizen/cities");
      console.log("Cities data:", citiesRes.data);
      setCities(citiesRes.data);

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

      // Fetch all issues for voting
      console.log("Fetching all issues for voting...");
      const allIssuesRes = await API.get("/citizen/all-issues");
      console.log("All issues data:", allIssuesRes.data);
      setAllIssues(allIssuesRes.data);

      // Finally fetch categories and set
      console.log("Fetching categories...");
      const categoriesRes = await API.get("/citizen/categories");
      console.log("Categories data:", categoriesRes.data);
      setCategories(categoriesRes.data);

      // Fetch leaderboard data
      await fetchLeaderboardData();
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      // Mock leaderboard data - in real implementation, this would come from APIs
      const mockCitizenLeaderboard = [
        { rank: 1, name: 'Rajinder Singh', city: 'Ludhiana', verifiedCount: 15, avatar: '👑' },
        { rank: 2, name: 'Gurpreet Kaur', city: 'Amritsar', verifiedCount: 12, avatar: '👑' },
        { rank: 3, name: 'Harpreet Singh', city: 'Patiala', verifiedCount: 10, avatar: '👑' },
        { rank: 4, name: 'Manjit Kaur', city: 'Jalandhar', verifiedCount: 8, avatar: '👤' },
        { rank: 5, name: 'Balwinder Singh', city: 'Bathinda', verifiedCount: 7, avatar: '👤' }
      ];
      
      const mockWardsLeaderboard = [
        { rank: 1, ward: 'Ward 1', city: 'Ludhiana', resolvedCount: 45, totalIssues: 50 },
        { rank: 2, ward: 'Ward 3', city: 'Amritsar', resolvedCount: 38, totalIssues: 42 },
        { rank: 3, ward: 'Ward 2', city: 'Patiala', resolvedCount: 32, totalIssues: 38 },
        { rank: 4, ward: 'Ward 5', city: 'Jalandhar', resolvedCount: 28, totalIssues: 35 },
        { rank: 5, ward: 'Ward 4', city: 'Bathinda', resolvedCount: 22, totalIssues: 28 }
      ];

      setCitizenLeaderboard(mockCitizenLeaderboard);
      setWardsLeaderboard(mockWardsLeaderboard);
      
      // Find user rank (mock - in real implementation, get from API)
      const userVerifiedCount = issues.filter(issue => issue.status === 'verified_by_councillor').length;
      const userRank = mockCitizenLeaderboard.findIndex(user => user.verifiedCount <= userVerifiedCount) + 1;
      setUserRank(userRank || mockCitizenLeaderboard.length + 1);
      
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
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

  // Handle city selection and fetch wards
  const handleCityChange = async (city) => {
    setNewIssue({...newIssue, city, ward_id: ""});
    if (city) {
      try {
        const wardsRes = await API.get(`/citizen/wards/${city}`);
        setWards(wardsRes.data);
      } catch (err) {
        console.error("Failed to fetch wards:", err);
        setWards([]);
      }
    } else {
      setWards([]);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await API.post('/citizen/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newPhotos = [...newIssue.photos, response.data.imageUrl];
      setNewIssue({...newIssue, photos: newPhotos});
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  // Get GPS coordinates
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setNewIssue({...newIssue, gps_coordinates: coordinates});
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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
        city: "",
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
      // Disable reopen button for 10 seconds
      setReopenDisabled(prev => ({ ...prev, [issueId]: true }));
      
      // Start countdown
      let countdown = 10;
      setReopenCountdown(prev => ({ ...prev, [issueId]: countdown }));
      
      const countdownInterval = setInterval(() => {
        countdown--;
        setReopenCountdown(prev => ({ ...prev, [issueId]: countdown }));
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          setReopenDisabled(prev => ({ ...prev, [issueId]: false }));
          setReopenCountdown(prev => ({ ...prev, [issueId]: 0 }));
        }
      }, 1000);

      // Send reopen request with object_id to update existing record
      const issue = issues.find(i => i._id === issueId);
      const payload = {
        reason,
        object_id: issue?._id // Include object_id to update existing record
      };
      
      await API.put(`/citizen/issues/${issueId}/reopen`, payload);
      
      // Show success message
      alert("Issue reopened successfully!");
      
      // Refresh data
      fetchData();
      
    } catch (err) {
      console.error("Failed to reopen issue:", err);
      alert("Failed to reopen issue");
      
      // Re-enable button on error
      setReopenDisabled(prev => ({ ...prev, [issueId]: false }));
      setReopenCountdown(prev => ({ ...prev, [issueId]: 0 }));
    }
  };

  const handleVote = async (issueId, voteType) => {
    try {
      const response = await API.post(`/citizen/issues/${issueId}/vote`, { vote_type: voteType });
      
      // Update the specific issue in allIssues array
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue._id === issueId 
            ? { 
                ...issue, 
                voteCounts: response.data.voteCounts, 
                userVote: response.data.userVote 
              }
            : issue
        )
      );
      
      alert(`Vote recorded: ${voteType === 'exists' ? 'Issue Exists' : 'Issue Does Not Exist'}`);
    } catch (err) {
      console.error("Failed to vote:", err);
      alert("Failed to vote on issue");
    }
  };

  const handleRemoveVote = async (issueId) => {
    try {
      const response = await API.delete(`/citizen/issues/${issueId}/vote`);
      
      // Update the specific issue in allIssues array
      setAllIssues(prevIssues => 
        prevIssues.map(issue => 
          issue._id === issueId 
            ? { 
                ...issue, 
                voteCounts: response.data.voteCounts, 
                userVote: response.data.userVote 
              }
            : issue
        )
      );
      
      alert("Vote removed successfully!");
    } catch (err) {
      console.error("Failed to remove vote:", err);
      alert("Failed to remove vote");
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
        {/* Tab Navigation */}
        <div className="punjab-card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('my-issues')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-issues'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Issues
              </button>
              <button
                onClick={() => setActiveTab('vote-issues')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vote-issues'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vote on Issues
              </button>
              <button
                onClick={() => setActiveTab('leaderboards')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leaderboards'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leaderboards
              </button>
            </nav>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activeTab === 'my-issues' ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{issues.length}</div>
                <div className="text-gray-600">My Issues</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {issues.filter(i => ["open", "verified_by_councillor", "assigned_to_department", "in-progress", "resolved_by_worker", "department_resolved"].includes(i.status)).length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">
                  {issues.filter(i => ["verified_resolved", "resolved"].includes(i.status)).length}
                </div>
                <div className="text-gray-600">Resolved</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-red-600">
                  {issues.filter(i => i.status === "reopened").length}
                </div>
                <div className="text-gray-600">Reopened</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{allIssues.length}</div>
                <div className="text-gray-600">Issues to Vote</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">
                  {allIssues.reduce((sum, issue) => sum + (issue.voteCounts?.exists || 0), 0)}
                </div>
                <div className="text-gray-600">Total "Exists" Votes</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-red-600">
                  {allIssues.reduce((sum, issue) => sum + (issue.voteCounts?.notExists || 0), 0)}
                </div>
                <div className="text-gray-600">Total "Not Exists" Votes</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {allIssues.filter(issue => issue.userVote).length}
                </div>
                <div className="text-gray-600">Your Votes</div>
              </div>
            </>
          )}
        </div>

        {/* My Issues List */}
        {activeTab === 'my-issues' && (
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
                        Ward: {issue.ward_id?.ward_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.category}
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
                      {issue.status === "resolved" && !issue.feedback_rating && (
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Give Feedback
                        </button>
                      )}
                      {issue.status === "resolved" || issue.status==="verified_resolved" && issue.feedback_rating && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReopenIssue(issue._id, "Not satisfied with resolution")}
                            disabled={reopenDisabled[issue._id]}
                            className={`text-red-600 hover:text-red-900 ${reopenDisabled[issue._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {reopenDisabled[issue._id] ? `Reopen (${reopenCountdown[issue._id]}s)` : 'Reopen'}
                          </button>
                        </div>
                      )}
                      {issue.status === "resolved" || issue.status==="verified_resolved" && !issue.feedback_rating && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Give Feedback
                          </button>
                          <button
                            onClick={() => handleReopenIssue(issue._id, "Not satisfied with resolution")}
                            disabled={reopenDisabled[issue._id]}
                            className={`text-red-600 hover:text-red-900 ${reopenDisabled[issue._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {reopenDisabled[issue._id] ? `Reopen (${reopenCountdown[issue._id]}s)` : 'Reopen'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Vote on Issues List */}
        {activeTab === 'vote-issues' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Vote on Other Citizens' Issues</h2>
              <p className="text-sm text-gray-600 mt-1">Help verify if issues reported by other citizens actually exist in your area</p>
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
                      Ward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Your Vote
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allIssues.map((issue) => (
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
                        {issue.category}
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
                        <div className="flex space-x-4">
                          <div className="text-green-600">
                            <span className="font-semibold">{issue.voteCounts?.exists || 0}</span>
                            <span className="text-xs ml-1">Exists</span>
                          </div>
                          <div className="text-red-600">
                            <span className="font-semibold">{issue.voteCounts?.notExists || 0}</span>
                            <span className="text-xs ml-1">Not Exists</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {issue.voteCounts?.total || 0} votes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {issue.userVote ? (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                issue.userVote === 'exists' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {issue.userVote === 'exists' ? 'Exists' : 'Not Exists'}
                              </span>
                              <button
                                onClick={() => handleRemoveVote(issue._id)}
                                className="text-gray-400 hover:text-red-600 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleVote(issue._id, 'exists')}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                              >
                                Exists
                              </button>
                              <button
                                onClick={() => handleVote(issue._id, 'not_exists')}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                              >
                                Not Exists
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leaderboards Tab */}
        {activeTab === 'leaderboards' && (
          <div className="space-y-8">
            {/* Personal Rank Card */}
            {userRank && (
              <div className="punjab-card p-6">
                <h3 className="text-xl font-bold punjab-text-primary mb-4">Your Ranking</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold punjab-text-secondary">#{userRank}</div>
                  <div>
                    <div className="text-lg font-semibold">Citizen Leaderboard</div>
                    <div className="text-gray-600">Based on verified issues by councillors</div>
                  </div>
                </div>
              </div>
            )}

            {/* Citizen Leaderboard */}
            <Leaderboard
              title="Top Citizens"
              subtitle="Most verified issues by councillors"
              data={citizenLeaderboard}
              type="citizen"
            />

            {/* Wards Leaderboard */}
            <Leaderboard
              title="Top Wards"
              subtitle="Wards with highest resolution rates"
              data={wardsLeaderboard}
              type="wards"
            />
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto">
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
                <label className="block text-gray-700 mb-1">City</label>
                <select
                  value={newIssue.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ward (if known)</label>
                <select
                  value={newIssue.ward_id}
                  onChange={(e) => setNewIssue({...newIssue, ward_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={!newIssue.city}
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
                <label className="block text-gray-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={imageUploading}
                />
                {imageUploading && <p className="text-sm text-blue-600">Uploading...</p>}
                {newIssue.photos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">Images uploaded: {newIssue.photos.length}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Location</label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Get Current Location
                </button>
                {newIssue.gps_coordinates.latitude && (
                  <p className="text-sm text-green-600 mt-1">
                    Location: {newIssue.gps_coordinates.latitude.toFixed(6)}, {newIssue.gps_coordinates.longitude.toFixed(6)}
                  </p>
                )}
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

