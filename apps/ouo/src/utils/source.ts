import projectSource from "virtual:source:pj";
import bgSource from "virtual:source:blog";
import { SourceTree, type Module } from "./source-tree";
import type { PJ, Blog } from "../../vite.config";

export const pjSource = new SourceTree<PJ, Record<string, Module<PJ>>>(
  projectSource,
);

export const blogSource = new SourceTree<Blog, Record<string, Module<Blog>>>(
  bgSource,
);
