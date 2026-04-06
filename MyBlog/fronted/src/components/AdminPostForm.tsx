import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AdminCategory, AdminPostRecord, AdminTag } from "../types";
import AdminTagMultiSelect from "./AdminTagMultiSelect";
import { type PostFormValues, postSchema } from "../lib/adminSchemas";

type Props = {
  categories: AdminCategory[];
  tags: AdminTag[];
  initialValue?: Partial<AdminPostRecord>;
  submitLabel: string;
  onSubmit: (payload: PostFormValues) => Promise<void> | void;
};

function AdminPostForm({ categories, tags, initialValue, submitLabel, onSubmit }: Props) {
  const isEditMode = Boolean(initialValue?.id);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      contentMarkdown: "",
      coverUrl: "",
      categorySlug: categories[0]?.slug ?? "",
      tagSlugs: [],
      status: "DRAFT",
    },
  });

  useEffect(() => {
    reset({
      title: initialValue?.title ?? "",
      slug: initialValue?.slug ?? "",
      summary: initialValue?.summary ?? "",
      contentMarkdown: initialValue?.contentMarkdown ?? "",
      coverUrl: initialValue?.coverUrl ?? "",
      categorySlug: initialValue?.categorySlug ?? categories[0]?.slug ?? "",
      tagSlugs: initialValue?.tagSlugs ?? [],
      status: initialValue?.status ?? "DRAFT",
    });
  }, [categories, initialValue, reset]);

  async function handleValidSubmit(values: PostFormValues) {
    await onSubmit(values);
    if (!isEditMode) {
      reset({
        title: "",
        slug: "",
        summary: "",
        contentMarkdown: "",
        coverUrl: "",
        categorySlug: categories[0]?.slug ?? "",
        tagSlugs: [],
        status: "DRAFT",
      });
    }
  }

  return (
    <form className="hand-drawn-card admin-form" onSubmit={handleSubmit(handleValidSubmit)}>
      <h3>{isEditMode ? "编辑文章" : "新增文章"}</h3>

      <div className="admin-grid-3-post">
        <label className="admin-field">
          <span>文章标题</span>
          <input
            {...register("title")}
            placeholder="例如：Spring Boot 学习笔记"
          />
          {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
        </label>
        <label className="admin-field">
          <span>文章 Slug</span>
          <input
            {...register("slug")}
            placeholder="例如：spring-boot-notes"
          />
          {errors.slug ? <p className="error-text">{errors.slug.message}</p> : null}
        </label>
        <label className="admin-field">
          <span>封面地址</span>
          <input
            {...register("coverUrl")}
            placeholder="可选，填写封面图片 URL"
          />
          {errors.coverUrl ? <p className="error-text">{errors.coverUrl.message}</p> : null}
        </label>
      </div>

      <label className="admin-field">
        <span>文章摘要</span>
        <textarea
          {...register("summary")}
          placeholder="用 1~2 句话概括文章内容"
          rows={3}
        />
        {errors.summary ? <p className="error-text">{errors.summary.message}</p> : null}
      </label>

      <div className="admin-grid-post-meta">
        <label className="admin-field">
          <span>所属分类</span>
          <select {...register("categorySlug")}>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categorySlug ? <p className="error-text">{errors.categorySlug.message}</p> : null}
        </label>

        <label className="admin-field">
          <span>发布状态</span>
          <select {...register("status")}>
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
          </select>
          {errors.status ? <p className="error-text">{errors.status.message}</p> : null}
        </label>

        <div className="admin-field">
          <span>文章标签</span>
          <Controller
            control={control}
            name="tagSlugs"
            render={({ field }) => (
              <AdminTagMultiSelect
                onChange={field.onChange}
                options={tags.map((tag) => ({ value: tag.slug, label: tag.name }))}
                value={field.value}
              />
            )}
          />
          {errors.tagSlugs ? <p className="error-text">{errors.tagSlugs.message}</p> : null}
        </div>
      </div>

      <label className="admin-field">
        <span>文章内容</span>
        <textarea
          {...register("contentMarkdown")}
          placeholder="请输入 Markdown 内容"
          rows={14}
        />
        {errors.contentMarkdown ? (
          <p className="error-text">{errors.contentMarkdown.message}</p>
        ) : null}
      </label>

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "提交中..." : submitLabel}
      </button>
    </form>
  );
}

export default AdminPostForm;
