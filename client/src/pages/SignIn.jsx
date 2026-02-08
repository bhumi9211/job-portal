import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading,setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    }finally{
      setLoading(false)
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-[#001F3D] via-[#213448] to-[#001F3D] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#213448] p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ED985F]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="mb-1 block text-sm text-gray-300">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#001F3D] px-4 py-2 pr-10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ED985F]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-[#ED985F] transition"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ED985F] py-2 font-semibold text-[#001F3D] transition hover:scale-[1.03]"
          >
            {loading && formData.email && formData.password ? (
               <span className="flex items-center justify-center gap-2">
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
               Signing In..
             </span>
           ) : (
             "Sign In"
           )}
         </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#ED985F] hover:underline">
            Sign Up
          </Link>
        </p>
        {/* <p className="mt-2 text-center text-sm text-gray-400">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-[#ED985F] hover:underline">
            Reset
          </Link>
        </p> */}
      </div>
    </section>
  );
};

export default SignIn;
