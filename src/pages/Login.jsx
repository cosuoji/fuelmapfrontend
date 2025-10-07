import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loginUser, getProfile } from "../services/authService";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/"); // redirect to home
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(form); // username + password
      login(user, token);
      toast.success("Login successful!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  

  return (
    <div className="max-w-md mx-auto  bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* Password with toggle */}
        <PasswordInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
