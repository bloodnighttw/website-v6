import Card from "@/components/card";
import CardLabel from "@/components/card/label";
import Link from "rpress/link";
import type { Lang } from "@/utils/i18n/config";
import { source } from "@/utils/source";

async function Project({ lang }: { lang: Lang }) {
  const projects = Object.values(source.getByLang(lang)).map((mod) => mod.zod);

  return (
    <>
      <div className="flex justify-center">
        <CardLabel>My Projects</CardLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map((project) => (
          <Link key={project.name} to={`/${lang}/projects/${project.name}`}>
            <Card className="p-6 h-full hover:bg-secondary-500/10 transition-colors cursor-pointer">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-4">
                {project.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Project;
