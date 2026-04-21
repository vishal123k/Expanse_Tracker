import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered!");
      navigate("/");
    } catch {
      alert("already login email");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Name"
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={handleSubmit}
        >
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;