import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Email"
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 border rounded"
          placeholder="Password"
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Don't have an account?{" "}
          <Link className="text-blue-500" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;