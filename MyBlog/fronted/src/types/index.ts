export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ProjectMeta = {
  name: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  demoUrl?: string;
};

export type LabelValue = {
  id: number;
  name: string;
  slug: string;
};

export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  coverUrl?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  project?: ProjectMeta;
};

export type PostDetail = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  coverUrl?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  project?: ProjectMeta;
};

export type ProjectItem = {
  id: number;
  name: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  demoUrl?: string;
  postSlug?: string;
};

export type DayItem = {
  time: string;
  activity: string;
  duration: string;
};

export type DayData = {
  source: string;
  documentTitle: string;
  items: DayItem[];
  updatedAt: string;
};

export type AdminCategoryStatus = "ENABLED" | "DISABLED";
export type AdminPostStatus = "DRAFT" | "PUBLISHED";

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: AdminCategoryStatus;
  postCount: number;
  updatedAt: string;
};

export type AdminTag = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
  updatedAt: string;
};

export type AdminProfile = {
  avatarText: string;
  siteName: string;
  name: string;
  bio: string;
  birthday: string;
  github: string;
  email: string;
  location: string;
  skills: string[];
  showAvatar: boolean;
  showName: boolean;
  showBio: boolean;
  showBirthday: boolean;
  showGithub: boolean;
  showEmail: boolean;
};

export type AdminPostRecord = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  coverUrl?: string;
  categorySlug: string;
  tagSlugs: string[];
  status: AdminPostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  project?: ProjectMeta;
};

export type AdminPostDraft = {
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  coverUrl?: string;
  categorySlug: string;
  tagSlugs: string[];
  status: AdminPostStatus;
};
