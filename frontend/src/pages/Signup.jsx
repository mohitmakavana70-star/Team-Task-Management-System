// pages/Signup.jsx
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/signup", form);
    loginUser(res.data);
    navigate("/dashboard");
    toast.success("Account created successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form onSubmit={submitHandler} className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        <input className="input" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select className="input" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>Member</option>
          <option>Admin</option>
        </select>

        <button className="w-full bg-indigo-600 p-3 rounded-xl font-semibold">
          Signup
        </button>

        <p className="text-center text-slate-400 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Login
        </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;