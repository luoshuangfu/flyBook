import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteManagedTag, listManagedTags, saveManagedTag } from "../api/adminStore";
import AdminConfirmDialog from "../components/AdminConfirmDialog";
import AdminDataTable from "../components/AdminDataTable";
import AdminDialog from "../components/AdminDialog";
import { tagSchema, type TagFormValues } from "../lib/adminSchemas";
import type { AdminTag } from "../types";

const emptyForm: TagFormValues = {
  id: undefined,
  name: "",
  slug: "",
  color: "#e69144",
  description: "",
};

function AdminTagsPage() {
  const [tags, setTags] = useState(listManagedTags());
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [pendingDelete, setPendingDelete] = useState<AdminTag | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: emptyForm,
  });

  const colorValue = watch("color");

  const visibleTags = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    if (!lower) {
      return tags;
    }
    return tags.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.slug.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
    );
  }, [keyword, tags]);

  const columns = useMemo<ColumnDef<AdminTag>[]>(
    () => [
      { accessorKey: "name", header: "标签" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "description", header: "说明" },
      {
        accessorKey: "color",
        header: "颜色",
        cell: ({ row }) => (
          <span className="admin-color-chip" style={{ background: row.original.color }}>
            {row.original.color}
          </span>
        ),
      },
      { accessorKey: "postCount", header: "文章数" },
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
    setTags(listManagedTags());
    if (nextMessage) {
      setMessage(nextMessage);
    }
  }

  function openCreateDialog() {
    setDialogMode("create");
    reset(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(tag: AdminTag) {
    setDialogMode("edit");
    reset({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      description: tag.description,
    });
    setDialogOpen(true);
  }

  function closeDialog(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      reset(emptyForm);
    }
  }

  function onSubmit(values: TagFormValues) {
    try {
      saveManagedTag(values);
      closeDialog(false);
      refresh(dialogMode === "edit" ? "标签已更新" : "标签已创建");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  function handleDeleteConfirm() {
    if (!pendingDelete) {
      return;
    }
    try {
      deleteManagedTag(pendingDelete.id);
      refresh("标签已删除");
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
          <span>标签总数</span>
          <strong>{tags.length}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>高频标签</span>
          <strong>{tags.filter((item) => item.postCount >= 2).length}</strong>
        </article>
        <article className="hand-drawn-card admin-stat-card">
          <span>待整理标签</span>
          <strong>{tags.filter((item) => item.postCount === 0).length}</strong>
        </article>
      </div>

      <section className="hand-drawn-card admin-panel">
        <div className="admin-panel-head">
          <h3>标签列表</h3>
          <div className="admin-filter-row">
            <label className="admin-filter-field">
              <span>搜索标签</span>
              <input
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索标签名称、Slug、说明"
                value={keyword}
              />
            </label>
            <div className="admin-filter-action">
              <button onClick={openCreateDialog} type="button">
                新增标签
              </button>
            </div>
          </div>
        </div>

        <AdminDataTable columns={columns} data={visibleTags} emptyText="没有匹配的标签" />
        {message ? <p className="admin-inline-message">{message}</p> : null}
      </section>

      <AdminDialog
        description="统一维护标签名称、Slug、颜色和说明。"
        onOpenChange={closeDialog}
        open={dialogOpen}
        title={dialogMode === "edit" ? "编辑标签" : "新增标签"}
      >
        <form className="admin-form admin-dialog-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="admin-field">
            <span>标签名称</span>
            <input {...register("name")} placeholder="例如：React" />
            {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
          </label>
          <label className="admin-field">
            <span>标签 Slug</span>
            <input {...register("slug")} placeholder="例如：react" />
            {errors.slug ? <p className="error-text">{errors.slug.message}</p> : null}
          </label>
          <div className="admin-grid-2">
            <label className="admin-field">
              <span>颜色值</span>
              <input {...register("color")} placeholder="#e69144" />
              {errors.color ? <p className="error-text">{errors.color.message}</p> : null}
            </label>
            <label className="admin-field">
              <span>颜色选择</span>
              <input
                onChange={(event) => setValue("color", event.target.value, { shouldValidate: true })}
                type="color"
                value={colorValue}
              />
            </label>
          </div>
          <label className="admin-field">
            <span>标签说明</span>
            <textarea
              {...register("description")}
              placeholder="简单说明该标签适用于什么主题"
              rows={4}
            />
          </label>
          <div className="admin-dialog-actions">
            <button className="admin-secondary-btn" onClick={() => closeDialog(false)} type="button">
              取消
            </button>
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? "保存中..." : dialogMode === "edit" ? "保存标签" : "新增标签"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <AdminConfirmDialog
        confirmText="确认删除"
        description={
          pendingDelete
            ? `确认删除标签“${pendingDelete.name}”吗？若仍被文章使用，系统会阻止删除。`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        open={Boolean(pendingDelete)}
        title="删除标签"
      />
    </section>
  );
}

export default AdminTagsPage;
