import projectSource from "virtual:source:pj";
import { SourceTree, type Module } from "./source-tree";
import type { PJ } from "../../vite.config";

export const source = new SourceTree<PJ, Record<string, Module<PJ>>>(
  projectSource,
);
