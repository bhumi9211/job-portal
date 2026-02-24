import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API } from "../services/authApi";
import { useLocation } from "react-router-dom";
const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState("")
  const [loading, setLoading] = useState(false);
  const location = useLocation()

  const fetchAllPosts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/post/all-posts",
        // {
      //   withCredentials: true,
      // }
      );
    setPosts(res.data)
    console.log(res.data)
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Posts are not available"
      );
    } finally {
      setLoading(false);
    }
  };

  
  const fetchPostsById = async (postId) => {
    try {
      setLoading(true);

      const res = await API.get(`/api/post/${postId}`,
        // {withCredentials: true}
      )
      setPost(res.data)
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Posts are not available"
      );
    } finally {
      setLoading(false);
    }
  };




  // ✅ Run only once on mount
  useEffect(() => {
    fetchAllPosts();
  }, [location.key]);

  return (
    <PostsContext.Provider value={{ posts,fetchPostsById,post }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
