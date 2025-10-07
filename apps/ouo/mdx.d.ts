declare module "*.mdx" {
  import type { ComponentType } from "react";

  interface MDXProps {
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }

  const MDXComponent: ComponentType<MDXProps>;
  export default MDXComponent;

  // If you export named exports from MDX
  export const frontmatter: Record<string, any>;
}
