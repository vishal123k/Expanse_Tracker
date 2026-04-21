import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default page reload
    setError(""); // Clear previous errors
    
    // Basic Client-Side Validation
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      
      // Briefly show success message before redirecting
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      // Check if backend sent a specific error message, otherwise show a generic one
      const message = err.response?.data?.message || "Email is already registered or invalid.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Consistent input styling
  const inputStyles = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans text-slate-800">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-900 text-white p-2 rounded-xl mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-center">Create an account</h2>
          <p className="text-slate-500 text-sm mt-1">Start tracking your expenses today</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
            Registration successful! Redirecting...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={inputStyles}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isLoading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={inputStyles}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isLoading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={inputStyles}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={isLoading || success}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-slate-600">
          Already have an account?{" "}
          <Link className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors" to="/">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;