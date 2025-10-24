import Card from "@/components/card";
import CardLabel from "@/components/card/label";
import Link from "rpress/link";
import type { Lang } from "@/utils/i18n/config";
import { source } from "@/utils/source";
import { createTranslate } from "@/utils/i18n/server";
import { TechStackIcon } from "@/components/tech-stack-icon";
import { cn } from "@/utils/cn";

async function Project({ lang }: { lang: Lang }) {
  const t = await createTranslate(lang);
  const projects = Object.values(source.getByLang(lang)).map((mod) => mod.zod);

  return (
    <>
      <div className="flex justify-center">
        <CardLabel>{t("projects.title")}</CardLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map((project) => (
          <Link key={project.name} to={`/${lang}/projects/${project.name}`}>
            <Card
              className={cn(
                "p-4 h-full cursor-pointer",
                "hover:bg-secondary-500/10",
                "transition-colors duration-200",
                "flex flex-col gap-4",
              )}
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="text-sm text-secondary-700 dark:text-secondary-300">
                  {project.description}
                </p>
              </div>

              {project.stack && project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-secondary-600 dark:text-secondary-400 opacity-70 hover:opacity-100 transition-opacity"
                      title={tech}
                    >
                      <TechStackIcon tech={tech} size={20} iconOnly />
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Project;
