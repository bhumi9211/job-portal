import { useState, useEffect, useCallback } from "react";
import PostCard from "../components/PostCard";
import { usePosts } from "../context/PostsContext";
import { API } from "../services/authApi";
import toast from "react-hot-toast";

const PostList = () => {
  const [search, setSearch] = useState("");
  const { posts } = usePosts();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (query = "") => {
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
      fetchPosts(search.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, fetchPosts]);  // ✅ fetchPosts stable dependency

  const displayedPosts = search ? results : posts;

  return (
    <section className="min-h-screen bg-[#001F3D] py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">
            Job <span className="text-[#ED985F]">Posts</span>
          </h2>
          <p className="mt-3 text-[#547792]">
            Explore all available opportunities
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-14 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="🔍 Search by title, skills, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full block p-4 rounded-xl bg-[#213448] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ED985F] outline-none text-lg"
          />
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-white">Searching...</p>
        ) : displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-16">
            {search ? "No posts found 😕" : "No posts available"}
          </p>
        )}
      </div>
    </section>
  );
};

export default PostList;
