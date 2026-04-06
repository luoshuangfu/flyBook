import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createManagedPost, listManagedCategories, listManagedTags } from "../api/adminStore";
import AdminPostForm from "../components/AdminPostForm";

function AdminPostCreatePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const categories = useMemo(() => listManagedCategories(), []);
  const tags = useMemo(() => listManagedTags(), []);

  return (
    <section className="admin-page-stack">
      <div className="admin-editor-wrap">
        <div className="admin-create-wrap">
          <AdminPostForm
            categories={categories}
            onSubmit={async (payload) => {
              createManagedPost(payload);
              setMessage("文章已创建，正在返回文章管理");
              setTimeout(() => navigate("/admin/posts"), 600);
            }}
            submitLabel="新增文章"
            tags={tags}
          />
          {message ? <p className="admin-inline-message">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}

export default AdminPostCreatePage;
