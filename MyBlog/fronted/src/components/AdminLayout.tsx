import { Navigate, Outlet } from "react-router-dom";

function AdminLayout() {
  const token = localStorage.getItem("myblog_admin_token");

  if (!token) {
    return <Navigate replace to="/admin/login" />;
  }

  return (
    <section className="admin-shell">
      <div className="admin-main">
        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;
