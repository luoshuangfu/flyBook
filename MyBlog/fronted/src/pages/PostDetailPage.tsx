import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchPostDetail } from "../api/post";
import type { PostDetail } from "../types";

function PostDetailPage() {
  const { idOrSlug } = useParams();
  const [detail, setDetail] = useState<PostDetail | null>(null);

  useEffect(() => {
    if (idOrSlug) {
      fetchPostDetail(idOrSlug).then(setDetail);
    }
  }, [idOrSlug]);

  if (!detail) {
    return <p>加载中...</p>;
  }

  return (
    <article className="hand-drawn-card detail-card">
      <h2>{detail.title}</h2>
      {detail.project && <p className="project-hint">{detail.project.description}</p>}
      <p className="detail-meta">
        {detail.category} | {new Date(detail.publishedAt).toLocaleString()}
      </p>
      <div className="tag-row">
        {detail.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{detail.contentMarkdown}</ReactMarkdown>
      </div>
      {detail.project && (
        <div className="project-links footer-links">
          {detail.project.githubUrl && (
            <a href={detail.project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {detail.project.demoUrl && (
            <a href={detail.project.demoUrl} target="_blank" rel="noreferrer">
              项目访问
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default PostDetailPage;
