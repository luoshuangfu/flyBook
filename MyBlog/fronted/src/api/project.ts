import type { ProjectItem } from "../types";
import { projects } from "../mock/data";

export async function fetchProjects() {
  return Promise.resolve(projects as ProjectItem[]);
}
