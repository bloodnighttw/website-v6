declare module "*.mdx" {
  import type { ComponentType } from "react";

  interface MDXProps {
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }

  const MDXComponent: ComponentType<MDXProps>;
  export default MDXComponent;

  export const frontmatter: Record<string, any>;
}

declare module "virtual:source:pj" {
  import type { ComponentType } from "react";

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

declare module "virtual:source:blog" {
  import type { ComponentType } from "react";

  interface MDXProps {
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }

  interface Module {
    default: ComponentType<MDXProps>;
    zod: import("../vite.config").Blog;
    preview: string | undefined;
  }

  const modules: Record<string, Module>;
  export default modules;
}
