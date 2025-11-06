import projectSource from "virtual:source:pj";
import bgSource from "virtual:source:blog";
import { SourceTree, type ProjectModule, type BlogModule } from "./source-tree";
import type { PJ, Blog } from "../../vite.config";

export const pjSource = new SourceTree<
  PJ,
  ProjectModule<PJ>,
  Record<string, ProjectModule<PJ>>
>(projectSource);

export const blogSource = new SourceTree<
  Blog,
  BlogModule<Blog>,
  Record<string, BlogModule<Blog>>
>(bgSource);
