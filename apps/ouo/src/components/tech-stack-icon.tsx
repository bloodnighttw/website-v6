import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiVite,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiRust,
  SiGo,
  SiTailwindcss,
  SiDocker,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiExpress,
  SiNestjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiWebpack,
  SiEsbuild,
  SiJest,
  SiVitest,
  SiCypress,
  SiStorybook,
  SiGit,
  SiGithub,
  SiGitlab,
  SiVercel,
  SiNetlify,
  SiGooglecloud,
  SiFigma,
  SiSupabase,
  SiFirebase,
  SiPrisma,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const techStackIcons: Record<string, IconType> = {
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  React: SiReact,
  Vite: SiVite,
  NextJS: SiNextdotjs,
  NodeJS: SiNodedotjs,
  Python: SiPython,
  Rust: SiRust,
  Go: SiGo,
  TailwindCSS: SiTailwindcss,
  Tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  Docker: SiDocker,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  GraphQL: SiGraphql,
  Express: SiExpress,
  NestJS: SiNestjs,
  Vue: SiVuedotjs,
  Angular: SiAngular,
  Svelte: SiSvelte,
  Webpack: SiWebpack,
  Esbuild: SiEsbuild,
  Jest: SiJest,
  Vitest: SiVitest,
  Cypress: SiCypress,
  Storybook: SiStorybook,
  Git: SiGit,
  GitHub: SiGithub,
  GitLab: SiGitlab,
  Vercel: SiVercel,
  Netlify: SiNetlify,
  GCP: SiGooglecloud,
  Figma: SiFigma,
  Supabase: SiSupabase,
  Firebase: SiFirebase,
  Prisma: SiPrisma,
};

export const validTechStacks = Object.keys(techStackIcons) as [
  string,
  ...string[],
];

interface TechStackIconProps {
  tech: string;
  size?: number;
  iconOnly?: boolean;
}

export function TechStackIcon({
  tech,
  size = 20,
  iconOnly = false,
}: TechStackIconProps) {
  const Icon = techStackIcons[tech];

  if (!Icon) {
    if (iconOnly) {
      return <span className="w-5 h-5 rounded-full bg-primary-500/20" />;
    }
    return (
      <span className="inline-flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-primary-500/20" />
        <span>{tech}</span>
      </span>
    );
  }

  if (iconOnly) {
    return <Icon size={size} />;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Icon size={size} />
      <span>{tech}</span>
    </span>
  );
}
