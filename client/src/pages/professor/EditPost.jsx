import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import  toast  from "react-hot-toast";
import { API } from "../../services/authApi";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  const [loading, setLoading] = useState(false);
  const [post,setPost] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mode: "remote",
    duration: "",
    stipend: 0,
    skillsRequired: [],
    applyBy: "",
    postImage: "",
    status: "open",
  });

  /* ================= FETCH POST BY ID ================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
  
        const res = await API.get(`/api/post/${id}`, {
          withCredentials: true,
        });
  
        const postData = res.data;
  
        // Update both post and formData completely
        setPost(postData); // for heading or display
  
        setFormData({
          title: postData.title ?? "",
          description: postData.description ?? "",
          mode: postData.mode ?? "remote",
          duration: postData.duration ?? "",
          stipend: postData.stipend ?? 0,
          skillsRequired: postData.skillsRequired ?? [],
          applyBy: postData.applyBy ? postData.applyBy.slice(0, 10) : "",
          postImage: postData.postImage ?? "",
          status: postData.status ?? "open",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchPost();
  }, [id,location.key]);
  

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.put(`/api/post/edit-post/${id}`, formData, {
        withCredentials: true,
      });

      toast.success("Post updated successfully ✅");
      navigate("/professor/my-posts");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Post not edited"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (loading)
    return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <section className="min-h-screen bg-[#001F3D] py-5">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-white mb-6">
          Edit Post — <span className="text-[#ED985F]">{post.title}</span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-[#213448] p-6 rounded-2xl shadow-lg space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Stipend
              </label>
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
              />
            </div>

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
                required
              />
            </div>

            {/* Apply By */}
            <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Apply By
              </label>
              <input
                type="date"
                name="applyBy"
                value={formData.applyBy}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
                required
              />
            </div>

            {/* Status */}
            {/* <div>
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div> */}

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Skills Required (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skillsRequired.join(", ")}
                onChange={handleSkillsChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
                required
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#9DB2BF] mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="postImage"
                value={formData.postImage}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001F3D] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-[#ED985F]"
              />
              {formData.postImage && (
                <img
                  src={formData.postImage}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/professor/my-posts")}
              className="px-5 py-2 rounded-lg border border-[#ED985F] text-[#ED985F] hover:bg-[#ED985F] hover:text-black transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#ED985F] text-black hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
