import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const {signup} = useAuth()
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
   

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
    const handleSubmit = async(e) => {
      e.preventDefault();
      setLoading(true)
      try {
        await signup(formData);
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed!");
      }finally{
        setLoading(false)
      }
    };
    
  

  return (
    <section className="min-h-screen bg-linear-to-br from-[#001F3D] via-[#213448] to-[#001F3D] flex items-center justify-center px-4">
      
      <div className="w-full max-w-md rounded-2xl bg-[#213448] p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Join as a Student or Professor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ED985F]"
            />
          </div>

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

          {/* Role Selection */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Sign up as
            </label>
            <div className="flex gap-4">
              
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[#547792] px-4 py-2 text-white hover:border-[#ED985F]">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  className="accent-[#ED985F]"
                />
                Student
              </label>

              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[#547792] px-4 py-2 text-white hover:border-[#ED985F]">
                <input
                  type="radio"
                  name="role"
                  value="professor"
                  checked={formData.role === "professor"}
                  onChange={handleChange}
                  className="accent-[#ED985F]"
                />
                Professor
              </label>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ED985F] py-2 font-semibold text-[#001F3D] transition hover:scale-[1.03]"
          >
            {loading  ? (
               <span className="flex items-center justify-center gap-2">
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
               Signing Up..
             </span>
           ) : (
             "Sign Up"
           )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/signin" className="text-[#ED985F] hover:underline">
            Login
          </Link>
        </p>

      </div>
    </section>
  );
};

export default SignUp;
