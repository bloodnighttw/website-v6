declare module "*.mdx" {
  import type { ComponentType, ComponentType } from "react";

  interface MDXProps {
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }

  const MDXComponent: ComponentType<MDXProps>;
  export default MDXComponent;

  export const frontmatter: Record<string, any>;
}

declare module "virtual:source:pj" {
  import type { ComponentType, ComponentType } from "react";

  interface MDXProps {
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }

  interface Module {
    default: ComponentType<MDXProps>;
    zod: import("../vite.config").PJ;
  }

  const modules: Record<string, Module>;
  export default modules;
}
