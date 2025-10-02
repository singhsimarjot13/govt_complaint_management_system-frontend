import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mlas, setMlas] = useState([]);
  const [mcs, setMcs] = useState([]);
  const [editMode, setEditMode] = useState({ type: "", id: null });

  const [mlaForm, setMlaForm] = useState({ name: "", email: "", constituency_location: "", password: "" });
  const [mcForm, setMcForm] = useState({ email: "", city: "", password: "" });

  const navigate = useNavigate();

  // Fetch protected Super Admin data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/super-admin/dashboard");
        setMessage(res.data.message);

        const mlaRes = await API.get("/super-admin/mlas");
        setMlas(mlaRes.data);

        const mcRes = await API.get("/super-admin/mcs");
        setMcs(mcRes.data);
      } catch (err) {
        console.error(err);
        setError("Unauthorized. Please login as Super Admin.");
        navigate("/login");
      }
    };
    fetchDashboard();
  }, [navigate]);

  // Handle Create / Update MLA
  const handleMLASubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editMode.type === "mla") {
        res = await API.put(`/super-admin/update-mla/${editMode.id}`, mlaForm);
      } else {
        res = await API.post("/super-admin/create-mla", mlaForm);
      }
      setSuccess(res.data.message);
      setError("");
      setMlaForm({ name: "", email: "", constituency_location: "", password: "" });
      setEditMode({ type: "", id: null });
      const mlaRes = await API.get("/super-admin/mlas");
      setMlas(mlaRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error in MLA operation");
    }
  };

  // Handle Create / Update MC Admin
  const handleMCSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editMode.type === "mc") {
        res = await API.put(`/super-admin/update-mc/${editMode.id}`, mcForm);
      } else {
        res = await API.post("/super-admin/create-mc", mcForm);
      }
      setSuccess(res.data.message);
      setError("");
      setMcForm({ email: "", city: "", password: "" });
      setEditMode({ type: "", id: null });
      const mcRes = await API.get("/super-admin/mcs");
      setMcs(mcRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error in MC Admin operation");
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      {message && <p className="text-gray-700 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Create/Update MLA */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editMode.type === "mla" ? "Update MLA" : "Create MLA"}</h2>
        <form onSubmit={handleMLASubmit} className="space-y-3">
          <input type="text" placeholder="Name" className="border p-2 w-full"
            value={mlaForm.name} onChange={(e) => setMlaForm({ ...mlaForm, name: e.target.value })} />
          <input type="email" placeholder="Email" className="border p-2 w-full"
            value={mlaForm.email} onChange={(e) => setMlaForm({ ...mlaForm, email: e.target.value })} />
          <input type="text" placeholder="Constituency Location" className="border p-2 w-full"
            value={mlaForm.constituency_location} onChange={(e) => setMlaForm({ ...mlaForm, constituency_location: e.target.value })} />
          <input type="password" placeholder="Password" className="border p-2 w-full"
            value={mlaForm.password} onChange={(e) => setMlaForm({ ...mlaForm, password: e.target.value })} />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {editMode.type === "mla" ? "Update MLA" : "Create MLA"}
          </button>
        </form>
      </div>

      {/* Create/Update MC Admin */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{editMode.type === "mc" ? "Update MC Admin" : "Create MC Admin"}</h2>
        <form onSubmit={handleMCSubmit} className="space-y-3">
          <input type="email" placeholder="Email" className="border p-2 w-full"
            value={mcForm.email} onChange={(e) => setMcForm({ ...mcForm, email: e.target.value })} />
          <input type="text" placeholder="City" className="border p-2 w-full"
            value={mcForm.city} onChange={(e) => setMcForm({ ...mcForm, city: e.target.value })} />
          <input type="password" placeholder="Password" className="border p-2 w-full"
            value={mcForm.password} onChange={(e) => setMcForm({ ...mcForm, password: e.target.value })} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editMode.type === "mc" ? "Update MC Admin" : "Create MC Admin"}
          </button>
        </form>
      </div>

      {/* MLA List */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">MLAs</h2>
        <ul className="space-y-2">
          {mlas.map((mla) => (
            <li key={mla._id} className="flex justify-between items-center border-b py-2">
              <span>{mla.name} ({mla.constituency_location})</span>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  setMlaForm({ name: mla.name, email: mla.email, constituency_location: mla.constituency_location, password: "" });
                  setEditMode({ type: "mla", id: mla._id });
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* MC Admin List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">MC Admins</h2>
        <ul className="space-y-2">
          {mcs.map((mc) => (
            <li key={mc._id} className="flex justify-between items-center border-b py-2">
              <span>{mc.email} ({mc.city})</span>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  setMcForm({ email: mc.email, city: mc.city, password: "" });
                  setEditMode({ type: "mc", id: mc._id });
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
