import type { LabelValue, PostDetail, PostListItem } from "../types";
import {
  getPublicCategories,
  getPublicPostDetail,
  getPublicPosts,
  getPublicTags,
} from "./adminStore";

export async function fetchPosts(category?: string, tag?: string) {
  return Promise.resolve(getPublicPosts(category, tag) as PostListItem[]);
}

export async function fetchPostDetail(idOrSlug: string) {
  const detail = getPublicPostDetail(idOrSlug) as PostDetail | undefined;
  if (!detail) {
    throw new Error("Post not found");
  }
  return Promise.resolve(detail);
}

export async function fetchCategories() {
  return Promise.resolve(getPublicCategories() as LabelValue[]);
}

export async function fetchTags() {
  return Promise.resolve(getPublicTags() as LabelValue[]);
}
