import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload on form submission
    setError(""); // Clear any previous errors

    // Basic client-side validation
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data); // Update global auth state
      navigate("/dashboard");
    } catch (err) {
      // Handle incorrect credentials gracefully
      const message = err.response?.data?.message || "Invalid email or password.";
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
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 text-center">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={inputStyles}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={inputStyles}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm mt-8 text-center text-slate-600">
          Don't have an account?{" "}
          <Link className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;