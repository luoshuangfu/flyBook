import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/admin/posts", label: "文章管理" },
  { to: "/admin/categories", label: "分类管理" },
  { to: "/admin/tags", label: "标签管理" },
  { to: "/admin/profile", label: "个人信息" },
];

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/admin/posts/new")) {
    return {
      title: "新增文章",
      desc: "作为独立页面录入文章，提交后返回文章管理列表。",
      path: "/admin/posts/new",
    };
  }

  if (pathname.startsWith("/admin/posts/") && pathname.endsWith("/edit")) {
    return {
      title: "修改文章",
      desc: "编辑单篇文章内容、分类、标签和发布状态。",
      path: pathname,
    };
  }

  if (pathname.startsWith("/admin/categories")) {
    return {
      title: "分类管理",
      desc: "统一维护分类名称、slug、状态和说明。",
      path: "/admin/categories",
    };
  }

  if (pathname.startsWith("/admin/tags")) {
    return {
      title: "标签管理",
      desc: "统一维护标签颜色、说明和文章关联情况。",
      path: "/admin/tags",
    };
  }

  if (pathname.startsWith("/admin/profile")) {
    return {
      title: "个人信息",
      desc: "维护站点名称、作者简介和展示开关。",
      path: "/admin/profile",
    };
  }

  return {
    title: "文章管理",
    desc: "统一提供检索、筛选、编辑、删除与保存反馈。",
    path: "/admin/posts",
  };
}

function AdminTopNav() {
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  return (
    <div className="admin-top-nav">
      <div className="admin-top-info">
        <div className="admin-title-row">
          <h2>{meta.title}</h2>
          <span className="admin-route-chip">{meta.path}</span>
        </div>
        <p className="admin-page-desc">{meta.desc}</p>
      </div>

      <nav className="admin-top-actions">
        {navItems.map((item) => (
          <Link
            key={item.to}
            className={`admin-nav-link${location.pathname.startsWith(item.to) ? " active" : ""}`}
            to={item.to}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default AdminTopNav;
