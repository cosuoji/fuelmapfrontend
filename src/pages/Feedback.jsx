import { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/feedback", form);
      setStatus("Thank you for your feedback!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-3">
      <h1 className="text-2xl font-bold mb-4 text-center">We value your feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="message"
          placeholder="Your Feedback"
          value={form.message}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows="4"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
      {status && <p className="text-center mt-4 text-gray-700">{status}</p>}
    </div>
  );
};

export default Feedback;
