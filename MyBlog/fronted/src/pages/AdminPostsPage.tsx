import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {
  deleteManagedPost,
  listManagedCategories,
  listManagedPosts,
  listManagedTags,
} from "../api/adminStore";
import AdminConfirmDialog from "../components/AdminConfirmDialog";
import AdminDataTable from "../components/AdminDataTable";
import type { AdminPostRecord } from "../types";

const PAGE_SIZE = 5;

function AdminPostsPage() {
  const [posts, setPosts] = useState(listManagedPosts());
  const [categories] = useState(listManagedCategories());
  const [tags] = useState(listManagedTags());
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");
  const [categorySlug, setCategorySlug] = useState("ALL");
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminPostRecord | null>(null);

  const categoryNameMap = useMemo(
    () => new Map(categories.map((item) => [item.slug, item.name])),
    [categories]
  );
  const tagNameMap = useMemo(() => new Map(tags.map((item) => [item.slug, item.name])), [tags]);

  const filteredPosts = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesKeyword =
        !lower ||
        post.title.toLowerCase().includes(lower) ||
        post.slug.toLowerCase().includes(lower) ||
        post.summary.toLowerCase().includes(lower);
      const matchesStatus = status === "ALL" || post.status === status;
      const matchesCategory = categorySlug === "ALL" || post.categorySlug === categorySlug;
      return matchesKeyword && matchesStatus && matchesCategory;
    });
  }, [categorySlug, keyword, posts, status]);

  const columns = useMemo<ColumnDef<AdminPostRecord>[]>(
    () => [
      {
        accessorKey: "title",
        header: "标题",
        cell: ({ row }) => (
          <div className="admin-title-cell">
            <strong>{row.original.title}</strong>
            <span>{row.original.slug}</span>
          </div>
        ),
      },
      {
        accessorKey: "categorySlug",
        header: "分类",
        cell: ({ row }) => categoryNameMap.get(row.original.categorySlug) ?? row.original.categorySlug,
      },
      {
        accessorKey: "tagSlugs",
        header: "标签",
        cell: ({ row }) => (
          <div className="tag-row">
            {row.original.tagSlugs.map((tagSlug) => (
              <span key={tagSlug} className="tag-pill">
                {tagNameMap.get(tagSlug) ?? tagSlug}
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => (row.original.status === "PUBLISHED" ? "已发布" : "草稿"),
      },
      {
        accessorKey: "updatedAt",
        header: "更新时间",
        cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="admin-action-cell">
            <Link to={`/admin/posts/${row.original.id}/edit`}>修改</Link>
            <button onClick={() => setPendingDelete(row.original)} type="button">
              删除
            </button>
          </div>
        ),
      },
    ],
    [categoryNameMap, tagNameMap]
  );

  function refresh(nextMessage?: string) {
    setPosts(listManagedPosts());
    if (nextMessage) {
      setMessage(nextMessage);
    }
  }

  function handleDeleteConfirm() {
    if (!pendingDelete) {
      return;
    }
    deleteManagedPost(pendingDelete.id);
    refresh("文章已删除");
    setPendingDelete(null);
  }

  return (
    <section className="admin-page-stack">
      <div className="admin-stat-grid">
        <article className="hand-drawn-card admin-stat-card">
          <span>文章总数</span>
          <strong>{posts.length}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>已发布</span>
          <strong>{posts.filter((post) => post.status === "PUBLISHED").length}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>草稿箱</span>
          <strong>{posts.filter((post) => post.status === "DRAFT").length}</strong>
        </article>
      </div>

      <section className="hand-drawn-card admin-panel">
        <div className="admin-panel-head">
          <div className="admin-filter-row admin-filter-row--single">
            <label className="admin-filter-field">
              <span>搜索文章</span>
              <input
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索标题、Slug、摘要"
                value={keyword}
              />
            </label>
            <label className="admin-filter-field">
              <span>文章状态</span>
              <select onChange={(event) => setStatus(event.target.value)} value={status}>
                <option value="ALL">全部状态</option>
                <option value="PUBLISHED">已发布</option>
                <option value="DRAFT">草稿</option>
              </select>
            </label>
            <label className="admin-filter-field">
              <span>所属分类</span>
              <select onChange={(event) => setCategorySlug(event.target.value)} value={categorySlug}>
                <option value="ALL">全部分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-filter-action">
              <Link className="admin-create-link" to="/admin/posts/new">
                新增文章
              </Link>
            </div>
          </div>
        </div>

        <AdminDataTable
          columns={columns}
          data={filteredPosts}
          emptyText="暂无符合条件的文章"
          pageSize={PAGE_SIZE}
        />
        {message ? <p className="admin-inline-message">{message}</p> : null}
      </section>

      <AdminConfirmDialog
        confirmText="确认删除"
        description={pendingDelete ? `确认删除文章“${pendingDelete.title}”吗？` : ""}
        onConfirm={handleDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        open={Boolean(pendingDelete)}
        title="删除文章"
      />
    </section>
  );
}

export default AdminPostsPage;
