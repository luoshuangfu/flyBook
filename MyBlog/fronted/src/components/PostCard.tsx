import { Link } from "react-router-dom";
import type { PostListItem } from "../types";

type Props = {
  post: PostListItem;
  onCategoryClick?: (slug: string) => void;
  onTagClick?: (slug: string) => void;
};

function PostCard({ post, onCategoryClick, onTagClick }: Props) {
  return (
    <article className="post-card hand-drawn-card">
      <h3>
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.summary}</p>
      <div className="post-meta">
        <button
          className="chip-link"
          onClick={() => onCategoryClick?.(post.category.toLowerCase().replace(/\s+/g, "-"))}
          type="button"
        >
          {post.category}
        </button>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
      <div className="tag-row">
        {post.tags.map((tag) => (
          <button
            key={tag}
            className="tag-pill"
            onClick={() => onTagClick?.(tag.toLowerCase().replace(/\s+/g, "-"))}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  );
}

export default PostCard;
