'use client'
import axios from "axios";
import { useState } from "react";

export default function Home() {

   const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("/api/auth/signup", form)
      
      setMessage(res.data.message || "Success");
      setForm({ username: "", email: "", phone: "", password: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Server connection error");
    }
  };

  return (
    <>
     <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
    </>
  );
}
