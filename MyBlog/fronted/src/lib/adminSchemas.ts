import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url("请输入合法的 URL")]);
const optionalEmail = z.union([z.literal(""), z.string().email("请输入合法的邮箱地址")]);
const optionalDate = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "请输入合法的日期"),
]);

export const loginSchema = z.object({
  username: z.string().trim().min(1, "请输入用户名"),
  password: z.string().trim().min(1, "请输入密码"),
});

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, "请输入分类名称"),
  slug: z.string().trim().min(1, "请输入分类 Slug"),
  description: z.string().trim(),
  status: z.enum(["ENABLED", "DISABLED"]),
});

export const tagSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, "请输入标签名称"),
  slug: z.string().trim().min(1, "请输入标签 Slug"),
  color: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "请输入合法的颜色值"),
  description: z.string().trim(),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "请输入文章标题"),
  slug: z.string().trim().min(1, "请输入文章 Slug"),
  summary: z.string().trim().min(1, "请输入文章摘要"),
  coverUrl: optionalUrl,
  categorySlug: z.string().trim().min(1, "请选择所属分类"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  tagSlugs: z.array(z.string()).min(1, "请至少选择一个文章标签"),
  contentMarkdown: z.string().trim().min(1, "请输入文章内容"),
});

export const profileSchema = z.object({
  avatarText: z.string().trim().min(1, "请输入头像文字").max(3, "头像文字最多 3 个字符"),
  siteName: z.string().trim().min(1, "请输入站点名称"),
  name: z.string().trim().min(1, "请输入昵称"),
  bio: z.string().trim().min(1, "请输入个人简介"),
  birthday: optionalDate,
  github: optionalUrl,
  email: optionalEmail,
  location: z.string().trim().min(1, "请输入地点"),
  skillText: z.string().trim(),
  showAvatar: z.boolean(),
  showName: z.boolean(),
  showBio: z.boolean(),
  showBirthday: z.boolean(),
  showGithub: z.boolean(),
  showEmail: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type TagFormValues = z.infer<typeof tagSchema>;
export type PostFormValues = z.infer<typeof postSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
