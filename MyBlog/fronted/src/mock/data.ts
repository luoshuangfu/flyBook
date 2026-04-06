export type ProjectMeta = {
  name: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  demoUrl?: string;
};

export const profile = {
  avatarText: "MY",
  name: "手绘风博主",
  bio: "记录技术与生活的小站。",
  birthday: "1996-06-18",
  github: "https://github.com/yourname",
  email: "you@example.com",
  showAvatar: true,
  showName: true,
  showBio: true,
  showBirthday: true,
  showGithub: true,
  showEmail: true,
};

export const categories = [
  { id: 1, name: "Java", slug: "java" },
  { id: 2, name: "前端", slug: "frontend" },
];

export const tags = [
  { id: 1, name: "Spring Boot", slug: "spring-boot" },
  { id: 2, name: "React", slug: "react" },
];

export const posts = [
  {
    id: 1,
    title: "手绘风博客",
    slug: "hand-drawn-blog-architecture",
    summary: "支持 Markdown、分类标签与飞书日程接入的博客系统。",
    contentMarkdown:
      "# 手绘风博客\n\n这是一个用于展示技术笔记与作品集的博客系统。\n\n## 功能\n- Markdown 笔记\n- 分类/标签筛选\n- 飞书“我的一天”接入\n",
    coverUrl: "",
    category: "Java",
    tags: ["Spring Boot", "React"],
    publishedAt: "2026-03-25T10:00:00Z",
    project: {
      name: "手绘风博客",
      description: "支持 Markdown、分类标签与飞书日程接入的博客系统。",
      techStack: "React, Spring Boot, MySQL",
      githubUrl: "https://github.com/example/hand-drawn-blog",
      demoUrl: "https://demo.example.com",
    } as ProjectMeta,
  },
  {
    id: 2,
    title: "React 页面结构与组件拆分",
    slug: "react-page-structure",
    summary: "首页、详情页、项目页、我的一天页的拆分思路与复用组件建议。",
    contentMarkdown:
      "# React 页面结构\n\n建议先按页面分目录，再抽离公共组件。\n\n- 页面级组件\n- 业务组件\n- 基础组件\n",
    coverUrl: "",
    category: "前端",
    tags: ["React"],
    publishedAt: "2026-03-24T15:00:00Z",
  },
];

export const projects = [
  {
    id: 1,
    name: "手绘风博客",
    description: "支持 Markdown、分类标签与飞书日程接入的博客系统。",
    techStack: "React, Spring Boot, MySQL",
    githubUrl: "https://github.com/example/hand-drawn-blog",
    demoUrl: "https://demo.example.com",
    postSlug: "hand-drawn-blog-architecture",
  },
  {
    id: 2,
    name: "番茄钟工作台",
    description: "一个极简任务计时工具，支持时间线复盘。",
    techStack: "Vue, TypeScript, IndexedDB",
    githubUrl: "https://github.com/example/pomodoro-board",
    demoUrl: "",
    postSlug: "react-page-structure",
  },
];

export const myDay = {
  source: "mock",
  documentTitle: "我的一天",
  updatedAt: "2026-03-25T10:00:00Z",
  items: [
    { time: "11:53", activity: "搭建工作流", duration: "-" },
    { time: "12:02", activity: "刷网页/资讯", duration: "20分钟" },
    { time: "12:29", activity: "xgt训练", duration: "51分钟" },
    { time: "14:46", activity: "阅读", duration: "32分钟" },
  ],
};
