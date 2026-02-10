import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../services/authApi";
import toast from "react-hot-toast";
import { usePosts } from "../context/PostsContext";

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const {post,fetchPostsById} = usePosts()

 

  useEffect(() => {
    if (!id) return;
  
    fetchPostsById(id);
  
    if (user?.role === "student") {
      checkApplied();
    }
  }, [id, user?.role]);
  
  

  // 🔑 Ownership check
  const isOwner =
  user?.role === "professor" && post?.postedBy === user?.id;

  const openApplyModal = () => setShowModal(true);
  const closeApplyModal = () => setShowModal(false);

  // const handleImage = (e)=>{
  //   let file = e.target.files[0]
  //   setResumeFile(file)
  //   setFrontendImage(URL.createObjectURL(file))
  // }

  const handleApplySubmit = async(e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData()
      formData.append("resume",resumeFile)
      const res = await API.post(`/api/post/${id}/apply`,formData, {withCredentials: true})
      setApplied(true);
      closeApplyModal();
      toast.success("Applied successfully 🎉")
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong..Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkApplied = async () => {
    try {
      const res = await API.get(
        `/api/application/${id}/already-applied`,
        { withCredentials: true }
      );
      setApplied(res.data.applied);
    } catch (err) {
    }
  };
  

  const editHandler = () => {
    navigate(`/professor/edit-post/${post._id}`);
  };

  const deleteHandler = async () => {
    if (!id) {
      toast.error("Post id not found");
      return;
    }
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
  
    if (!confirmed) return;
  
    try {
      await API.delete(`/api/post/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Post deleted successfully ✅");
      setPost(null);
      navigate(-1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  };
  

  if (loading)
    return <p className="mt-20 text-center text-white">Loading...</p>;

  if (!post)
    return <p className="mt-20 text-center text-white">Post not found</p>;

  return (
    <section className="min-h-screen bg-[#001F3D] py-24">
      <div className="mx-auto max-w-5xl rounded-2xl bg-[#213448] p-8 text-white">
        <div
          className={`grid gap-8 ${
            post.postImage ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* LEFT: Image */}
          {post.postImage && (
            <img
              src={post.postImage}
              alt={post.title}
              className="h-full w-full rounded-xl object-cover"
            />
          )}

          {/* RIGHT: Info */}
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  post.status === "open"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {post.status}
              </span>
            </div>

            <p className="mt-4 text-gray-300">{post.description}</p>

            <div className="mt-6 space-y-2">
              <p><b>Mode:</b> {post.mode}</p>
              <p><b>Duration:</b> {post.duration}</p>
              <p><b>Stipend:</b> ₹{post.stipend}</p>
              <p><b>Apply By:</b> {new Date(post.applyBy).toDateString()}</p>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {post.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#ED985F] px-3 py-1 text-sm text-[#001F3D]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex gap-3">
              {/* STUDENT */}
              {user?.role === "student" && (
                <button
                  disabled={applied || post.status === "closed"}
                  onClick={openApplyModal}
                  className={`w-full rounded-xl py-3 font-semibold transition ${
                    applied
                      ? "cursor-not-allowed bg-gray-500"
                      : "bg-[#ED985F] text-[#001F3D] hover:scale-105"
                  }`}
                >
                  {applied ? "Already Applied" : "Apply Now"}
                </button>
              )}

              {/* PROFESSOR (OWNER ONLY) */}
              {isOwner && (
                <>
                  <button
                    onClick={editHandler}
                    className="flex-1 rounded-lg border border-[#ED985F] px-4 py-2 text-[#ED985F] hover:bg-[#ED985F] hover:text-black transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteHandler}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-[#213448] p-6 text-white">
            <h2 className="mb-4 text-xl font-semibold">Upload Resume</h2>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full text-sm file:rounded-lg file:bg-[#ED985F] file:px-3 file:py-2 file:text-[#001F3D]"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeApplyModal}
                  className="rounded-lg border border-[#ED985F] px-4 py-2 text-[#ED985F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#ED985F] px-4 py-2 text-black"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewPost;
