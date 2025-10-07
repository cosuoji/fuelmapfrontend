import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom"; // ✅ import Link
import { registerUser } from "../services/authService";
import { useAuth } from "../store/useAuth";
import PasswordInput from "../components/PasswordInput";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/"); // redirect to home if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validations
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const strongPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPass.test(form.password)) {
      toast.error("Password must include uppercase, number & special character");
      return;
    }

    try {
      const { token, user } = await registerUser(form);
      login(user, token);
      toast.success("Signup successful!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <PasswordInput
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />

        <PasswordInput
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Confirm Password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>

      {/* 👇 Added login prompt */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}
