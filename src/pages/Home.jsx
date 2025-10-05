import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import HeatmapDistrict from '../components/HeatmapDistrict';
import Leaderboard from '../components/Leaderboard';
import PunjabPhulkari from '../components/PunjabPhulkari';
import '../theme/punjab-theme.css';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIssues: 0,
    totalResolved: 0,
    activeWorkers: 0,
    totalDepartments: 0
  });
  const [districts, setDistricts] = useState([]);
  const [citizenLeaderboard, setCitizenLeaderboard] = useState([]);
  const [mcAdminLeaderboard, setMcAdminLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      // Fetch stats first
      const statsRes = await API.get('/super-admin/dashboard');
      setStats({
        totalIssues: statsRes.data?.totalIssues || 0,
        totalResolved: statsRes.data?.resolvedIssues || 0,
        activeWorkers: statsRes.data?.activeWorkers || 0,
        totalDepartments: statsRes.data?.totalDepartments || 0
      });

      // Then fetch districts (MC Admins)
      const districtsRes = await API.get('/super-admin/mcs');
      setDistricts(districtsRes.data || []);

      // Fetch leaderboards sequentially
      const citizenLbRes = await API.get('/super-admin/leaderboard/citizens');
      setCitizenLeaderboard(citizenLbRes.data?.citizens || []);

      const mcAdminLbRes = await API.get('/super-admin/leaderboard/mcadmins');
      setMcAdminLeaderboard(mcAdminLbRes.data?.mcAdmins || []);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictClick = (districtId) => {
    navigate(`/mc-admin/dashboard?district=${districtId}`);
  };

  const handleReportIssue = () => {
    navigate('/login?role=citizen');
  };

  const handleAdminLogin = () => {
    navigate('/login?role=admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-punjab-indigo to-punjab-green flex items-center justify-center">
        <div className="text-white text-xl">Loading Punjab Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-punjab-indigo to-punjab-green">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold punjab-text-primary">Punjab Portal</h1>
              <button onClick={() => navigate('/about-punjab')} className="text-gray-700 hover:text-punjab-indigo transition-colors">
                About Punjab
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReportIssue}
                className="punjab-btn-primary"
              >
                Login (Citizen)
              </button>
              <button
                onClick={handleAdminLogin}
                className="punjab-btn-secondary"
              >
                Login (Admins)
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Punjab State Civic Issue
                <span className="block punjab-text-secondary">Reporting Portal</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Report civic issues in your Punjab district — quick, local, accountable
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReportIssue}
                  className="punjab-btn-secondary text-lg px-8 py-4"
                >
                  Report an Issue
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 transition-all text-lg px-8 py-4 rounded-2xl"
                >
                  Admin Login
                </button>
              </div>
            </div>
            <div className="relative">
              <PunjabPhulkari />
            </div>
          </div>
        </div>
      </section>

      {/* Punjab Heatmap */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Punjab District Overview</h2>
            <p className="text-xl text-white/90">Click on any district to view detailed analytics</p>
          </div>
          <div className="punjab-card p-8">
            <HeatmapDistrict 
              districts={districts}
              onDistrictClick={handleDistrictClick}
            />
          </div>
        </div>
      </section>

      {/* Statistics Widget */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="punjab-card p-6 text-center">
              <div className="text-3xl font-bold punjab-text-primary">{stats.totalIssues}</div>
              <div className="text-gray-600">Total Issues</div>
            </div>
            <div className="punjab-card p-6 text-center">
              <div className="text-3xl font-bold punjab-text-accent">{stats.totalResolved}</div>
              <div className="text-gray-600">Resolved</div>
            </div>
            <div className="punjab-card p-6 text-center">
              <div className="text-3xl font-bold punjab-text-secondary">{stats.activeWorkers}</div>
              <div className="text-gray-600">Active Workers</div>
            </div>
            <div className="punjab-card p-6 text-center">
              <div className="text-3xl font-bold punjab-text-primary">{stats.totalDepartments}</div>
              <div className="text-gray-600">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Leaderboard
              title="Top Citizens"
              subtitle="Most verified issues by councillors"
              data={citizenLeaderboard}
              type="citizen"
            />
            <Leaderboard
              title="Top MC Admins"
              subtitle="Districts with highest resolution rates"
              data={mcAdminLeaderboard}
              type="mcAdmin"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-punjab-indigo text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg">Punjab State Civic Issue Reporting Portal</p>
          <p className="text-sm text-white/70 mt-2">Empowering citizens, strengthening communities</p>
        </div>
      </footer>
    </div>
  );
}
