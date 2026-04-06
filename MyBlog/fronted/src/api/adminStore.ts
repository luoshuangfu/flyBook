import { categories, posts, profile, tags } from "../mock/data";
import type {
  AdminCategory,
  AdminCategoryStatus,
  AdminPostDraft,
  AdminPostRecord,
  AdminProfile,
  AdminTag,
  LabelValue,
  PostDetail,
  PostListItem,
} from "../types";

const CATEGORY_KEY = "myblog_admin_categories";
const TAG_KEY = "myblog_admin_tags";
const PROFILE_KEY = "myblog_admin_profile";
const POST_KEY = "myblog_admin_posts";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readStorage<T>(key: string, seed: () => T) {
  if (typeof window === "undefined") {
    return seed();
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {}

  const initial = seed();
  writeStorage(key, initial);
  return initial;
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedCategories(): AdminCategory[] {
  const now = new Date().toISOString();
  return categories.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: `${item.name} 相关文章归档`,
    status: "ENABLED" as AdminCategoryStatus,
    postCount: 0,
    updatedAt: now,
  }));
}

function seedTags(): AdminTag[] {
  const palette = ["#e69144", "#7ea172", "#5c8ddb", "#b66ad7"];
  const now = new Date().toISOString();
  return tags.map((item, index) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: `${item.name} 主题标签`,
    color: palette[index % palette.length],
    postCount: 0,
    updatedAt: now,
  }));
}

function seedProfile(): AdminProfile {
  return {
    avatarText: profile.avatarText,
    siteName: "手绘风个人博客",
    name: profile.name,
    bio: profile.bio,
    birthday: profile.birthday,
    github: profile.github,
    email: profile.email,
    location: "上海",
    skills: ["React", "Spring Boot", "写作"],
    showAvatar: profile.showAvatar,
    showName: profile.showName,
    showBio: profile.showBio,
    showBirthday: profile.showBirthday,
    showGithub: profile.showGithub,
    showEmail: profile.showEmail,
  };
}

function seedPosts(): AdminPostRecord[] {
  return posts.map((item) => {
    const categorySlug =
      categories.find((category) => category.name === item.category)?.slug ?? slugify(item.category);
    const tagSlugs = item.tags.map(
      (tagName) => tags.find((tag) => tag.name === tagName)?.slug ?? slugify(tagName)
    );
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      contentMarkdown: item.contentMarkdown,
      coverUrl: item.coverUrl,
      categorySlug,
      tagSlugs,
      status: "PUBLISHED",
      createdAt: item.publishedAt,
      updatedAt: item.publishedAt,
      publishedAt: item.publishedAt,
      project: item.project,
    };
  });
}

function getRawCategories() {
  return readStorage<AdminCategory[]>(CATEGORY_KEY, seedCategories);
}

function getRawTags() {
  return readStorage<AdminTag[]>(TAG_KEY, seedTags);
}

function getRawPosts() {
  return readStorage<AdminPostRecord[]>(POST_KEY, seedPosts);
}

function getRawProfile() {
  return readStorage<AdminProfile>(PROFILE_KEY, seedProfile);
}

export function listManagedPosts() {
  return getRawPosts().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getManagedPost(id: number) {
  return getRawPosts().find((item) => item.id === id);
}

export function createManagedPost(payload: AdminPostDraft) {
  const items = getRawPosts();
  if (items.some((item) => item.slug === payload.slug)) {
    throw new Error("文章 slug 已存在，请更换后再保存");
  }

  const now = new Date().toISOString();
  const next: AdminPostRecord = {
    id: items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1,
    ...payload,
    createdAt: now,
    updatedAt: now,
    publishedAt: payload.status === "PUBLISHED" ? now : undefined,
  };

  writeStorage(POST_KEY, [next, ...items]);
  return next;
}

export function updateManagedPost(id: number, payload: AdminPostDraft) {
  const items = getRawPosts();
  if (items.some((item) => item.id !== id && item.slug === payload.slug)) {
    throw new Error("文章 slug 已存在，请更换后再保存");
  }

  writeStorage(
    POST_KEY,
    items.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return {
        ...item,
        ...payload,
        updatedAt: new Date().toISOString(),
        publishedAt:
          payload.status === "PUBLISHED"
            ? item.publishedAt ?? new Date().toISOString()
            : undefined,
      };
    })
  );
}

export function deleteManagedPost(id: number) {
  writeStorage(
    POST_KEY,
    getRawPosts().filter((item) => item.id !== id)
  );
}

export function listManagedCategories() {
  const postMap = getRawPosts().reduce<Record<string, number>>((acc, item) => {
    acc[item.categorySlug] = (acc[item.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  return getRawCategories()
    .map((item) => ({
      ...item,
      postCount: postMap[item.slug] ?? 0,
    }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

export function saveManagedCategory(input: {
  id?: number;
  name: string;
  slug: string;
  description: string;
  status: AdminCategoryStatus;
}) {
  const items = getRawCategories();
  const normalizedSlug = slugify(input.slug || input.name);
  if (items.some((item) => item.id !== input.id && item.slug === normalizedSlug)) {
    throw new Error("分类 slug 已存在");
  }

  if (input.id) {
    const previous = items.find((item) => item.id === input.id);
    writeStorage(
      CATEGORY_KEY,
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              ...input,
              slug: normalizedSlug,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    if (previous && previous.slug !== normalizedSlug) {
      writeStorage(
        POST_KEY,
        getRawPosts().map((post) =>
          post.categorySlug === previous.slug ? { ...post, categorySlug: normalizedSlug } : post
        )
      );
    }
    return;
  }

  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  writeStorage(CATEGORY_KEY, [
    {
      id: nextId,
      name: input.name,
      slug: normalizedSlug,
      description: input.description,
      status: input.status,
      postCount: 0,
      updatedAt: new Date().toISOString(),
    },
    ...items,
  ]);
}

export function deleteManagedCategory(id: number) {
  const items = getRawCategories();
  const target = items.find((item) => item.id === id);
  if (!target) {
    return;
  }
  if (getRawPosts().some((item) => item.categorySlug === target.slug)) {
    throw new Error("该分类下仍有关联文章，请先调整文章分类");
  }
  writeStorage(
    CATEGORY_KEY,
    items.filter((item) => item.id !== id)
  );
}

export function listManagedTags() {
  const postMap = getRawPosts().reduce<Record<string, number>>((acc, item) => {
    item.tagSlugs.forEach((slug) => {
      acc[slug] = (acc[slug] ?? 0) + 1;
    });
    return acc;
  }, {});

  return getRawTags()
    .map((item) => ({
      ...item,
      postCount: postMap[item.slug] ?? 0,
    }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
}

export function saveManagedTag(input: {
  id?: number;
  name: string;
  slug: string;
  color: string;
  description: string;
}) {
  const items = getRawTags();
  const normalizedSlug = slugify(input.slug || input.name);
  if (items.some((item) => item.id !== input.id && item.slug === normalizedSlug)) {
    throw new Error("标签 slug 已存在");
  }

  if (input.id) {
    const previous = items.find((item) => item.id === input.id);
    writeStorage(
      TAG_KEY,
      items.map((item) =>
        item.id === input.id
          ? {
              ...item,
              ...input,
              slug: normalizedSlug,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    if (previous && previous.slug !== normalizedSlug) {
      writeStorage(
        POST_KEY,
        getRawPosts().map((post) => ({
          ...post,
          tagSlugs: post.tagSlugs.map((slug) => (slug === previous.slug ? normalizedSlug : slug)),
        }))
      );
    }
    return;
  }

  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  writeStorage(TAG_KEY, [
    {
      id: nextId,
      name: input.name,
      slug: normalizedSlug,
      color: input.color,
      description: input.description,
      postCount: 0,
      updatedAt: new Date().toISOString(),
    },
    ...items,
  ]);
}

export function deleteManagedTag(id: number) {
  const items = getRawTags();
  const target = items.find((item) => item.id === id);
  if (!target) {
    return;
  }
  if (getRawPosts().some((item) => item.tagSlugs.includes(target.slug))) {
    throw new Error("该标签仍被文章使用，请先移除文章上的关联标签");
  }
  writeStorage(
    TAG_KEY,
    items.filter((item) => item.id !== id)
  );
}

export function getManagedProfile() {
  return getRawProfile();
}

export function saveManagedProfile(nextProfile: AdminProfile) {
  writeStorage(PROFILE_KEY, nextProfile);
}

export function getPublicCategories(): LabelValue[] {
  return listManagedCategories()
    .filter((item) => item.status === "ENABLED")
    .map((item) => ({ id: item.id, name: item.name, slug: item.slug }));
}

export function getPublicTags(): LabelValue[] {
  return listManagedTags().map((item) => ({ id: item.id, name: item.name, slug: item.slug }));
}

export function getPublicPosts(categorySlug?: string, tagSlug?: string): PostListItem[] {
  const categoryMap = new Map(listManagedCategories().map((item) => [item.slug, item.name]));
  const tagMap = new Map(listManagedTags().map((item) => [item.slug, item.name]));

  return listManagedPosts()
    .filter((item) => item.status === "PUBLISHED")
    .filter((item) => (!categorySlug ? true : item.categorySlug === categorySlug))
    .filter((item) => (!tagSlug ? true : item.tagSlugs.includes(tagSlug)))
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      coverUrl: item.coverUrl,
      category: categoryMap.get(item.categorySlug) ?? item.categorySlug,
      tags: item.tagSlugs.map((slug) => tagMap.get(slug) ?? slug),
      publishedAt: item.publishedAt ?? item.updatedAt,
      project: item.project,
    }));
}

export function getPublicPostDetail(idOrSlug: string): PostDetail | undefined {
  const categoryMap = new Map(listManagedCategories().map((item) => [item.slug, item.name]));
  const tagMap = new Map(listManagedTags().map((item) => [item.slug, item.name]));
  const target = listManagedPosts().find(
    (item) => item.status === "PUBLISHED" && (String(item.id) === idOrSlug || item.slug === idOrSlug)
  );

  if (!target) {
    return undefined;
  }

  return {
    id: target.id,
    title: target.title,
    slug: target.slug,
    summary: target.summary,
    contentMarkdown: target.contentMarkdown,
    coverUrl: target.coverUrl,
    category: categoryMap.get(target.categorySlug) ?? target.categorySlug,
    tags: target.tagSlugs.map((slug) => tagMap.get(slug) ?? slug),
    publishedAt: target.publishedAt ?? target.updatedAt,
    project: target.project,
  };
}
