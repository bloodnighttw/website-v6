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

declare module "virtual:source:*" {
  const modules: Record<string, string>;
  export default modules;
}
