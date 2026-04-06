import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteManagedCategory, listManagedCategories, saveManagedCategory } from "../api/adminStore";
import AdminConfirmDialog from "../components/AdminConfirmDialog";
import AdminDataTable from "../components/AdminDataTable";
import AdminDialog from "../components/AdminDialog";
import { categorySchema, type CategoryFormValues } from "../lib/adminSchemas";
import type { AdminCategory } from "../types";

const emptyForm: CategoryFormValues = {
  id: undefined,
  name: "",
  slug: "",
  description: "",
  status: "ENABLED",
};

function AdminCategoriesPage() {
  const [categories, setCategories] = useState(listManagedCategories());
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyForm,
  });

  const visibleCategories = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    if (!lower) {
      return categories;
    }
    return categories.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.slug.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
    );
  }, [categories, keyword]);

  const enabledCount = categories.filter((item) => item.status === "ENABLED").length;

  const columns = useMemo<ColumnDef<AdminCategory>[]>(
    () => [
      { accessorKey: "name", header: "分类名" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "description", header: "说明" },
      { accessorKey: "postCount", header: "文章数" },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => (row.original.status === "ENABLED" ? "启用" : "停用"),
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="admin-action-cell">
            <button onClick={() => openEditDialog(row.original)} type="button">
              编辑
            </button>
            <button onClick={() => setPendingDelete(row.original)} type="button">
              删除
            </button>
          </div>
        ),
      },
    ],
    []
  );

  function refresh(nextMessage?: string) {
    setCategories(listManagedCategories());
    if (nextMessage) {
      setMessage(nextMessage);
    }
  }

  function openCreateDialog() {
    setDialogMode("create");
    reset(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(category: AdminCategory) {
    setDialogMode("edit");
    reset({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
    });
    setDialogOpen(true);
  }

  function closeDialog(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      reset(emptyForm);
    }
  }

  function onSubmit(values: CategoryFormValues) {
    try {
      saveManagedCategory(values);
      closeDialog(false);
      refresh(dialogMode === "edit" ? "分类已更新" : "分类已创建");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  function handleDeleteConfirm() {
    if (!pendingDelete) {
      return;
    }
    try {
      deleteManagedCategory(pendingDelete.id);
      refresh("分类已删除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <section className="admin-page-stack">
      <div className="admin-stat-grid">
        <article className="hand-drawn-card admin-stat-card">
          <span>分类总数</span>
          <strong>{categories.length}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>启用分类</span>
          <strong>{enabledCount}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>停用分类</span>
          <strong>{categories.length - enabledCount}</strong>
        </article>
      </div>

      <section className="hand-drawn-card admin-panel">
        <div className="admin-panel-head">
          <h3>分类列表</h3>
          <div className="admin-filter-row">
            <label className="admin-filter-field">
              <span>搜索分类</span>
              <input
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索分类名称、Slug、说明"
                value={keyword}
              />
            </label>
            <div className="admin-filter-action">
              <button onClick={openCreateDialog} type="button">
                新增分类
              </button>
            </div>
          </div>
        </div>

        <AdminDataTable columns={columns} data={visibleCategories} emptyText="没有匹配的分类" />
        {message ? <p className="admin-inline-message">{message}</p> : null}
      </section>

      <AdminDialog
        description="统一维护分类名称、Slug、状态和说明。"
        onOpenChange={closeDialog}
        open={dialogOpen}
        title={dialogMode === "edit" ? "编辑分类" : "新增分类"}
      >
        <form className="admin-form admin-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="admin-field">
            <span>分类名称</span>
            <input {...register("name")} placeholder="例如：前端" />
            {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
          </label>
          <label className="admin-field">
            <span>分类 Slug</span>
            <input {...register("slug")} placeholder="例如：frontend" />
            {errors.slug ? <p className="error-text">{errors.slug.message}</p> : null}
          </label>
          <label className="admin-field">
            <span>分类说明</span>
            <textarea
              {...register("description")}
              placeholder="简单说明该分类会收录什么内容"
              rows={4}
            />
          </label>
          <label className="admin-field">
            <span>分类状态</span>
            <select {...register("status")}>
              <option value="ENABLED">启用</option>
              <option value="DISABLED">停用</option>
            </select>
          </label>
          <div className="admin-dialog-actions">
            <button className="admin-secondary-btn" onClick={() => closeDialog(false)} type="button">
              取消
            </button>
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? "保存中..." : dialogMode === "edit" ? "保存分类" : "新增分类"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <AdminConfirmDialog
        confirmText="确认删除"
        description={
          pendingDelete
            ? `确认删除分类“${pendingDelete.name}”吗？若仍有关联文章，系统会阻止删除。`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        open={Boolean(pendingDelete)}
        title="删除分类"
      />
    </section>
  );
}

export default AdminCategoriesPage;
