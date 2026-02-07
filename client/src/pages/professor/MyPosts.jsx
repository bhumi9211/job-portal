import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { API } from "../../services/authApi";
import toast from "react-hot-toast";

const MyPosts = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= FETCH MY POSTS ================= */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/post/my-posts", {
        withCredentials: true,
      });
      setPosts(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Posts not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [location.key]);

  /* ================= DELETE POST ================= */
  const deletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await API.delete(`/api/post/delete/${postId}`, {
        withCredentials: true,
      });
      toast.success("Post deleted successfully");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  /* ================= SEARCH POSTS ================= */
  const fetchSearchedPosts = useCallback(async (query = "") => {
    try {
      setLoading(true);

      if (query && query.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      const params = {};
      if (query && query.length >= 2) params.search = query;

      const searchParams = new URLSearchParams(params);
      const url = `/api/post/search${searchParams.toString() ? `?${searchParams}` : ""}`;


      const res = await API.get(url);
      
      setResults(res.data); 

    } catch (err) {
      toast.error("Search error:", err.response?.data || err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSearchedPosts(search.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, fetchSearchedPosts]);

  /* ================= FINAL POSTS ================= */
  const displayedPosts = search ? results : posts;

  /* ================= UI ================= */
  return (
    <section className="min-h-screen bg-[#001F3D] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            My <span className="text-[#ED985F]">Job Posts</span>
          </h2>
          <p className="mt-3 text-[#547792]">
            Manage your posted opportunities
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-12 max-w-xl">
          <input
            type="text"
            placeholder="Search.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#213448] px-5 py-3 text-white
              placeholder-gray-400 outline-none
              focus:ring-2 focus:ring-[#ED985F]"
          />
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-white">Loading posts...</p>
        ) : displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <div
                key={post._id}
                className="overflow-hidden rounded-2xl bg-[#213448] text-white
                  shadow-lg transition hover:scale-[1.02]"
              >
                {/* Image */}
                <img
                  src={post.postImage}
                  alt={post.title}
                  className="h-40 w-full object-cover"
                />

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2 flex justify-between">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  <p className="mb-4 text-sm text-[#9DB2BF]">
                    {post.company}
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="flex-1 rounded-lg bg-[#ED985F] py-2 text-black"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/professor/edit-post/${post._id}`)
                        }
                        className="flex-1 rounded-lg border border-[#ED985F]
                          py-2 text-[#ED985F] hover:bg-[#ED985F] hover:text-black"
                      >
                        Edit
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/professor/post/${post._id}/applicants`)
                      }
                      className="rounded-lg border border-gray-500 py-2 text-sm
                        hover:bg-gray-600/20"
                    >
                      👥 View Applicants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-gray-400">
            You have not posted any jobs yet 😕
          </p>
        )}
      </div>
    </section>
  );
};

export default MyPosts;
