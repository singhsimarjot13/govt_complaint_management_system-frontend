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
      const res = await API.post("/auth/login", { email, password, role });

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Role-wise Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Register as Citizen
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
