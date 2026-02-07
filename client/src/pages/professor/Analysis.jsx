import { useEffect, useState } from "react";
import { API } from "../../services/authApi";
import toast from "react-hot-toast";


const Analysis = () => {
    const [overview,setOverView ] = useState("")
    const [posts,setPosts ] = useState([])
    const [loading,setLoading] = useState(false)

 
    const getPostsPerformance = async() =>{
        try {
            setLoading(true)
            const res = await API.get('/api/analysis/posts',{withCredentials: true})
            setPosts(res.data.posts);
            setOverView(res.data.summary);
          } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
          } finally {
            setLoading(false);
          }
        };

        useEffect(()=>{
            getPostsPerformance()
        },[])


  
    return (
      <section className="min-h-screen bg-[#001F3D] text-white p-6 space-y-8">
        
        {/* Page Title */}
        <h1 className="text-2xl font-bold">📊 Analysis</h1>
  
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Posts" value={overview.totalPosts} />
          {/* <StatCard title="Total Views" value={overview.totalViews} /> */}
          <StatCard title="Applicants" value={overview.totalApplicants} />
          <StatCard title="Active Posts" value={overview.activePosts} />
        </div>
  
        {/* Post Performance */}
        <div className="space-y-4">
  {posts.map((post) => (
    <div
      key={post._id}
      className="bg-[#001F3D] p-4 rounded-xl flex justify-between items-center border-b border-gray-600"
    >
      {/* Left Side */}
      <div>
        <p className="font-semibold flex items-center gap-3">
        <span className="max-w-40 sm:max-w-none truncate">
    {post.title}
  </span>

          {/* Rank Badge */}
          {post.applicantsRank && (
    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold shrink-0">
      {post.applicantsRank}
    </span>
  )}
        </p>

        <p className="text-sm text-gray-400">
          🧑‍🎓 {post.applicants} applicants
        </p>
      </div>

      {/* Right Side – Individual Interest */}
      <div className="text-right">
        <p className="text-[#ED985F] font-bold text-xl">
          {post.individualPerformance}%
        </p>
        <p className="text-xs text-gray-400">Interest</p>
      </div>
    </div>
  ))}
</div>


  
        {/* Student Interest */}
        {/* <div className="bg-[#213448] rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">
            🎯 Student Interest
          </h2>
  
          <ul className="space-y-2 text-sm">
            <li>📌 Web Development — 42%</li>
            <li>🤖 AI / ML — 30%</li>
            <li>📊 Data Science — 18%</li>
            <li>📚 Others — 10%</li>
          </ul>
        </div> */}
      </section>
    );
  };
  
  // Reusable Stat Card
  const StatCard = ({ title, value }) => {
    return (
      <div className="bg-[#213448] rounded-xl p-4 text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-[#ED985F]">{value}</p>
      </div>
    );
  };
  
  export default Analysis;
  