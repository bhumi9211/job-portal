import { useState } from "react";
import { API } from "../../services/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/PostsContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mode: "remote",
    duration: "",
    stipend: "",
    skillsRequired: "",
    applyBy: "",
    postImage: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      postImage: e.target.files[0],
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("mode", formData.mode);
      data.append("duration", formData.duration);
      data.append("stipend", formData.stipend);
      data.append(
        "skillsRequired",
        formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
      );
      data.append("applyBy", formData.applyBy);

      if (formData.postImage) {
        data.append("postImage", formData.postImage);
      }

      const res = await API.post("/api/post/create-post", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created successfully ✅");
      navigate("/professor/my-posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Post not created");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001F3D] py-16 text-white">
      <div className="max-w-4xl mx-auto bg-[#213448] p-6 rounded-2xl shadow-xl">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Create Job Post
        </h1>
        <p className="text-[#547792] mb-6">
          Fill the details below to publish a new opportunity
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TITLE */}
            <div>
              <label className="label">Job Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer Intern"
                className="input"
              />
            </div>

            {/* MODE */}
            <div>
              <label className="label">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="input"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="label">Duration</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                placeholder="3 Months"
                className="input"
              />
            </div>

            {/* STIPEND */}
            <div>
              <label className="label">Stipend (₹)</label>
              <input
                type="number"
                name="stipend"
                required
                value={formData.stipend}
                onChange={handleChange}
                placeholder="10000"
                className="input"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="label">Skills Required</label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="input"
              />
              <p className="text-xs text-[#547792] mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* APPLY BY */}
            <div>
              <label className="label">Apply By</label>
              <input
                type="date"
                name="applyBy"
                required
                value={formData.applyBy}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="label">Job Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role and responsibilities"
              className="input resize-none"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="label">Post Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#547792]
                         file:mr-4 file:rounded-lg file:border-0
                         file:bg-[#547792] file:px-4 file:py-2
                         file:text-white hover:file:bg-[#ED985F]"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#ED985F] text-[#001F3D] hover:scale-[1.02]"
              }`}
          >
            {loading ? "Publishing..." : "Publish Job"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;
