import { useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchPosts, fetchTags } from "../api/post";
import type { LabelValue, PostListItem } from "../types";
import PostCard from "../components/PostCard";
import SidebarFilter from "../components/SidebarFilter";
import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";

function HomePage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [categories, setCategories] = useState<LabelValue[]>([]);
  const [tags, setTags] = useState<LabelValue[]>([]);
  const [category, setCategory] = useState<string>();
  const [tag, setTag] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchTags().then(setTags);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts(category, tag)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [category, tag]);

  const visiblePosts = useMemo(() => {
    const filtered = posts.filter((post) => !post.project);
    if (!keyword.trim()) {
      return filtered;
    }
    const lower = keyword.trim().toLowerCase();
    return filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.summary.toLowerCase().includes(lower) ||
        post.tags.some((item) => item.toLowerCase().includes(lower))
    );
  }, [posts, keyword]);

  return (
    <div className="home-layout">
      <section>
        <div className="hand-drawn-card hero-card">
          <h2>技术笔记</h2>
        </div>
        <div className="hand-drawn-card search-bar">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索文章标题、摘要或标签..."
          />
        </div>
        {loading ? (
          <p>加载中...</p>
        ) : (
          visiblePosts.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              onCategoryClick={(slug) => {
                setCategory(slug);
                setTag(undefined);
              }}
              onTagClick={(slug) => {
                setTag(slug);
                setCategory(undefined);
              }}
            />
          ))
        )}
      </section>

      <aside>
        <ProfileCard />
        <SidebarFilter
          title="分类"
          items={categories}
          selected={category}
          onSelect={(slug) => {
            setCategory(slug);
            setTag(undefined);
          }}
          variant="category"
        />
        <SidebarFilter
          title="标签"
          items={tags}
          selected={tag}
          onSelect={(slug) => {
            setTag(slug);
            setCategory(undefined);
          }}
          variant="tag"
        />
      </aside>
    </div>
  );
}

export default HomePage;
