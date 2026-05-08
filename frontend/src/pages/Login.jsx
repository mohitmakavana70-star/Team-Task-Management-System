import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/login", form);
    loginUser(res.data);
    navigate("/dashboard");
    toast.success("Login successful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-slate-400 mb-6">Login to manage your team tasks.</p>

        <input
          className="w-full mb-4 p-3 rounded-xl bg-slate-800 outline-none"
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full mb-6 p-3 rounded-xl bg-slate-800 outline-none"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl font-semibold">
          Login
        </button>

        <p className="text-center text-slate-400 mt-5">
        Don't have an account?{" "}
        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create one
        </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
