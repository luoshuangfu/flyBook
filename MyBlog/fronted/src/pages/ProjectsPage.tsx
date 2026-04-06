import { useEffect, useMemo, useState } from "react";
import { fetchProjects } from "../api/project";
import type { ProjectItem } from "../types";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const visibleProjects = useMemo(() => {
    if (!keyword.trim()) {
      return projects;
    }
    const lower = keyword.trim().toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lower) ||
        project.description.toLowerCase().includes(lower) ||
        project.techStack.toLowerCase().includes(lower)
    );
  }, [projects, keyword]);

  return (
    <section>
      <h2 className="section-title">项目展示</h2>
      <div className="hand-drawn-card search-bar">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索项目名称、简介或技术栈..."
        />
      </div>
      <div className="project-grid">
        {visibleProjects.map((project) => (
          <article key={project.id} className="hand-drawn-card project-card">
            <h3>
              {project.postSlug ? <Link to={`/posts/${project.postSlug}`}>{project.name}</Link> : project.name}
            </h3>
            <p>{project.description}</p>
            <p className="tech-line">技术栈：{project.techStack}</p>
            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  在线演示
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProjectsPage;
