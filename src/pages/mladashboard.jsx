import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../theme/punjab-theme.css";

export default function MLADashboard() {
  const [profile, setProfile] = useState(null);
  const [wards, setWards] = useState([]);
  const [wardStats, setWardStats] = useState({});
  const [issues, setIssues] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedWards, setSelectedWards] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
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
      
      // Fetch analytics data
      await fetchAnalyticsData();
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // Mock analytics data - in real implementation, this would come from APIs
      const mockAnalytics = {
        departmentPerformance: [
          { department: 'Roads', resolved: 45, total: 60, efficiency: 75 },
          { department: 'Water', resolved: 32, total: 40, efficiency: 80 },
          { department: 'Sewerage', resolved: 28, total: 35, efficiency: 80 },
          { department: 'Electricity', resolved: 20, total: 30, efficiency: 67 }
        ],
        councillorPerformance: [
          { councillor: 'Rajinder Singh', ward: 'Ward 1', resolved: 25, total: 30, efficiency: 83 },
          { councillor: 'Gurpreet Kaur', ward: 'Ward 2', resolved: 20, total: 25, efficiency: 80 },
          { councillor: 'Harpreet Singh', ward: 'Ward 3', resolved: 18, total: 22, efficiency: 82 }
        ],
        trends: {
          raised: [10, 15, 12, 18, 20, 16, 14],
          resolved: [8, 12, 10, 15, 18, 14, 12]
        }
      };
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
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

  const handleWardSelection = (wardId) => {
    if (selectedWards.includes(wardId)) {
      setSelectedWards(selectedWards.filter(id => id !== wardId));
    } else {
      setSelectedWards([...selectedWards, wardId]);
    }
  };

  const handleExportCSV = () => {
    if (selectedWards.length === 0) {
      alert('Please select at least one ward to export data');
      return;
    }

    // Create CSV data
    const csvData = [];
    selectedWards.forEach(wardId => {
      const ward = wards.find(w => w._id === wardId);
      const stats = wardStats[wardId];
      csvData.push({
        'Ward Name': ward?.name || 'Unknown',
        'Councillor': ward?.councillor_id?.name || 'Not Assigned',
        'MC Admin': ward?.mc_admin_id?.name || 'N/A',
        'Total Issues': stats?.totalIssues || 0,
        'Resolved Issues': stats?.resolvedIssues || 0,
        'Pending Issues': stats?.pendingIssues || 0,
        'Resolution Rate': stats?.totalIssues > 0 ? 
          Math.round((stats.resolvedIssues / stats.totalIssues) * 100) : 0
      });
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mla-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
              <h1 className="text-2xl font-bold punjab-text-primary">MLA Dashboard</h1>
              <p className="text-sm text-gray-600">
                Constituency: Punjab | Role: Member of Legislative Assembly
              </p>
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

        {/* Tab Navigation */}
        <div className="punjab-card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-punjab-indigo text-punjab-indigo'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Ward Selection for Analytics */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">Select Wards for Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {wards.map((ward) => (
                  <label key={ward._id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWards.includes(ward._id)}
                      onChange={() => handleWardSelection(ward._id)}
                      className="rounded border-gray-300 text-punjab-indigo focus:ring-punjab-indigo"
                    />
                    <span className="text-sm text-gray-700">{ward.name}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleExportCSV}
                disabled={selectedWards.length === 0}
                className="punjab-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
            </div>

            {/* Department Performance */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">Department Performance</h3>
              <div className="space-y-4">
                {analyticsData.departmentPerformance?.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{dept.department}</div>
                      <div className="text-sm text-gray-600">
                        {dept.resolved} of {dept.total} resolved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold punjab-text-accent">{dept.efficiency}%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Councillor Performance */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">Councillor Performance</h3>
              <div className="space-y-4">
                {analyticsData.councillorPerformance?.map((councillor, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{councillor.councillor}</div>
                      <div className="text-sm text-gray-600">{councillor.ward}</div>
                      <div className="text-sm text-gray-600">
                        {councillor.resolved} of {councillor.total} resolved
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold punjab-text-accent">{councillor.efficiency}%</div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends Chart */}
            <div className="punjab-card p-6">
              <h3 className="text-lg font-semibold punjab-text-primary mb-4">Resolution Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-gray-600">Trend chart would be displayed here</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Raised: {analyticsData.trends?.raised?.join(', ')} | 
                    Resolved: {analyticsData.trends?.resolved?.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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