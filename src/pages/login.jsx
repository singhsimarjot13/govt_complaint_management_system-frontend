import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // backend returns JWT in HTTP-only cookie
      const res = await API.post("/auth/login", { email, password, role },{withCredentials:true});

      if (res.data.success) {
        // redirect based on role (no token stored in localStorage)
        switch (role) {
          case "super_admin":
            navigate("/super-admin/dashboard");
            break;
          case "mc_admin":
            navigate("/mc-admin/dashboard");
            break;
          case "councillor":
            navigate("/councillor/dashboard");
            break;
          case "department_admin":
            navigate("/department/dashboard");
            break;
          case "worker":
            navigate("/worker/dashboard");
            break;
          case "mla":
            navigate("/mla/dashboard");
            break;
          case "citizen":
            navigate("/citizen/dashboard");
            break;
          default:
            navigate("/citizen/dashboard");
        }
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-punjab-indigo to-punjab-green">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <button onClick={() => navigate('/')} className="text-2xl font-bold punjab-text-primary">
                Punjab Portal
              </button>
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-punjab-indigo transition-colors">
                Home
              </button>
              <a href="#about" className="text-gray-700 hover:text-punjab-indigo transition-colors">About Punjab</a>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setRole('citizen')} className={`punjab-btn-secondary ${role==='citizen' ? 'ring-2 ring-punjab-accent' : ''}`}>
                Citizen Login
              </button>
              <button onClick={() => setRole('mc_admin')} className={`punjab-btn-primary ${role==='mc_admin' ? 'ring-2 ring-punjab-accent' : ''}`}>
                Admin/MC/Dept/Worker Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Card */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold punjab-text-primary">
              Punjab State Civic Issue Reporting Portal
            </h2>
            <p className="text-sm text-gray-600 mt-1">Secure role-based access</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => setRole('citizen')} className={`px-3 py-2 rounded-lg border ${role==='citizen' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              Citizen
            </button>
            <button onClick={() => setRole('super_admin')} className={`px-3 py-2 rounded-lg border ${role==='super_admin' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              Super Admin
            </button>
            <button onClick={() => setRole('mc_admin')} className={`px-3 py-2 rounded-lg border ${role==='mc_admin' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              MC Admin
            </button>
            <button onClick={() => setRole('councillor')} className={`px-3 py-2 rounded-lg border ${role==='councillor' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              Councillor
            </button>
            <button onClick={() => setRole('department_admin')} className={`px-3 py-2 rounded-lg border ${role==='department_admin' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              Department
            </button>
            <button onClick={() => setRole('worker')} className={`px-3 py-2 rounded-lg border ${role==='worker' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              Worker
            </button>
            <button onClick={() => setRole('mla')} className={`col-span-2 px-3 py-2 rounded-lg border ${role==='mla' ? 'bg-punjab-indigo text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              MLA
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-punjab-indigo"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-punjab-indigo"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-punjab-indigo"
              >
                <option value="citizen">Citizen</option>
                <option value="super_admin">Super Admin</option>
                <option value="mc_admin">MC Admin</option>
                <option value="councillor">Councillor</option>
                <option value="department_admin">Department Admin</option>
                <option value="worker">Worker</option>
                <option value="mla">MLA</option>
              </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 punjab-btn-primary"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-punjab-indigo hover:text-punjab-indigo-light font-semibold"
              >
                Register as Citizen
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
