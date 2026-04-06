import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPostForm from "../components/AdminPostForm";
import {
  getManagedPost,
  listManagedCategories,
  listManagedTags,
  updateManagedPost,
} from "../api/adminStore";

function AdminPostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const categories = useMemo(() => listManagedCategories(), []);
  const tags = useMemo(() => listManagedTags(), []);
  const post = useMemo(() => getManagedPost(Number(postId)), [postId]);

  if (!post) {
    return (
      <section className="hand-drawn-card admin-panel">
        <h3>文章不存在</h3>
        <p>该文章可能已被删除，请返回文章管理页重新选择。</p>
        <Link to="/admin/posts">返回文章管理</Link>
      </section>
    );
  }

  return (
    <section className="admin-page-stack">
      <div className="admin-editor-wrap">
        <div className="admin-create-wrap">
          <AdminPostForm
            categories={categories}
            initialValue={post}
            onSubmit={async (payload) => {
              updateManagedPost(post.id, payload);
              setMessage("文章已更新，正在返回文章管理");
              setTimeout(() => navigate("/admin/posts"), 600);
            }}
            submitLabel="保存修改"
            tags={tags}
          />
          {message ? <p className="admin-inline-message">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}

export default AdminPostEditPage;
