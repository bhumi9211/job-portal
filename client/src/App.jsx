import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoute from "./routes/PublicRoute"
import "./index.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import ViewPost from "./pages/ViewPost";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import CreatePost from "./pages/professor/CreatePost";
import ProfessorHome from "./pages/professor/ProfessorHome";
import { Toaster } from "react-hot-toast";
import PostList from "./pages/PostList";
import NotFound from "./pages/NotFound";
import MyPosts from "./pages/professor/MyPosts";
import PostApplicants from "./pages/professor/PostApplicants";
import EditPost from "./pages/professor/EditPost";
import MyApplications from "./pages/student/MyApplications";
import Profile from "./pages/Profile";
import ViewResume from "./pages/professor/ViewResume";
import UserProfile from "./pages/professor/UserProfile";
import ProfessorMessages from "./pages/professor/ProfessorMessages";
import Analysis from "./pages/professor/Analysis";

function App() {
  const { pathname } = useLocation();

  const hideNavbar =
    pathname === "/signin" ||
    pathname === "/signUp" ||
    pathname === "/signup" ||
    pathname === "/professor" ||
    pathname === "/professor/create-post" ||
    pathname === "/professor/my-posts" ||
    pathname === "/professor/analysis" ||
    pathname === "/student/messages" ||
    pathname === "/messages" ||
    pathname.startsWith("/professor/edit-post") ||
    (pathname.startsWith("/professor/post/") &&
      pathname.endsWith("/applicants")) ||
    (pathname.startsWith("/professor/applications/") &&
      pathname.endsWith("/resume"));

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={["student", "professor"]} />}
        >
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/messages" element={<ProfessorMessages />} />
        </Route>

        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/applications" element={<MyApplications />} />
        </Route>

        {/* Professor routes */}
        <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
          <Route path="/professor" element={<ProfessorDashboard />}>
            <Route index element={<ProfessorHome />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="create-post" element={<CreatePost />} />
           
            <Route path="analysis" element={<Analysis />} />
            <Route
              path="/professor/post/:id/applicants"
              element={<PostApplicants />}
            />
            <Route
              path="/professor/applications/:applicationId/resume"
              element={<ViewResume />}
            />
              
            <Route path="edit-post/:id" element={<EditPost />} />
          </Route>
          <Route path="/messages" element={<ProfessorMessages />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
export default App;
