import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminTopNav from "./components/AdminTopNav";
import AdminLayout from "./components/AdminLayout";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import DayPage from "./pages/DayPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminTagsPage from "./pages/AdminTagsPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdminPostsPage from "./pages/AdminPostsPage";
import AdminPostCreatePage from "./pages/AdminPostCreatePage";
import AdminPostEditPage from "./pages/AdminPostEditPage";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showAdminManageNav = isAdminRoute && location.pathname !== "/admin/login";

  return (
    <div className="shell-bg">
      <header className={`top-nav hand-drawn-card${showAdminManageNav ? " top-nav-admin" : ""}`}>
        {!showAdminManageNav && <h1>手绘风个人博客与作品集</h1>}
        {showAdminManageNav ? (
          <AdminTopNav />
        ) : (
          <nav>
            <Link to="/">首页</Link>
            <Link to="/projects">项目展示</Link>
            <Link to="/my-day">我的一天</Link>
          </nav>
        )}
      </header>

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:idOrSlug" element={<PostDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/my-day" element={<DayPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate replace to="posts" />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="tags" element={<AdminTagsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="posts/new" element={<AdminPostCreatePage />} />
            <Route path="posts/:postId/edit" element={<AdminPostEditPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
