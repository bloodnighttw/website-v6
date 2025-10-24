import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import type { Lang } from "@/utils/i18n/config";
import { source } from "@/utils/source";
import Card from "@/components/card";
import { cn } from "@/utils/cn";
import { HiExternalLink, HiEye } from "react-icons/hi";
import { createTranslate } from "@/utils/i18n/server";

export const route = createRoute("/:lang/projects/:pj", {
  generator: async () => {
    console.log("Generating routes for /:lang", source.entries());
    const routes = [] as { lang: string; pj: string }[];
    for (const entry of source.entries()) {
      const pj = entry;
      routes.push({ lang: "en", pj: pj[0] });
      routes.push({ lang: "zh", pj: pj[0] });
    }

    return routes;
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, { lang: props.params.lang as Lang });
  const Flatten = helper.flatten();
  const t = await createTranslate(props.params.lang as Lang);
  const [dyComponent] = await source.search(
    [props.params.pj],
    props.params.lang,
  );
  const DyComponent = dyComponent.default;

  const metadata = dyComponent.zod;

  return (
    <Flatten>
      <Card
        className={cn(
          "p-6 mb-8",
          "bg-primary-500/10 backdrop-blur-sm",
          "border border-primary-500/20",
        )}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                {metadata.name}
              </h1>
            </div>

            {metadata.description && (
              <div>
                <p className="text-base text-secondary-700 dark:text-secondary-300">
                  {metadata.description}
                </p>
              </div>
            )}
          </div>

          {metadata.link && (
            <div className="flex flex-wrap md:flex-col gap-4">
              <a
                target="_blank"
                href={metadata.link}
                className={cn(
                  "inline-flex items-center gap-2 px-2 py-2 rounded-lg",
                  "bg-primary-500/5 hover:bg-primary-500/10",
                  "text-primary-900 dark:text-primary-100",
                  "transition-colors duration-200",
                  "border border-primary-500/30",
                )}
              >
                <HiExternalLink size={18} />
                <span className="font-medium">{t("projects.repository")}</span>
              </a>
            </div>
          )}
        </div>
      </Card>

      {metadata.demo && (
        <Card
          className={cn(
            "p-6 mb-8",
            "bg-primary-500/10 backdrop-blur-sm",
            "border border-primary-500/20",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {t("projects.liveDemo")}
            </h2>
            <a
              target="_blank"
              href={metadata.demo}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-lg",
                "bg-primary-500/5 hover:bg-primary-500/10",
                "text-secondary-900 dark:text-secondary-100",
                "transition-colors duration-200",
                "border border-secondary-500/30",
              )}
              title={t("projects.liveDemo")}
            >
              <HiExternalLink size={18} />
            </a>
          </div>
          <div className="relative w-full rounded-lg overflow-hidden border border-primary-500/30">
            <div className="aspect-video w-full">
              <iframe
                src={metadata.demo}
                className="w-full h-full rounded-lg"
                title={`${metadata.name} - Live Demo`}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <DyComponent />
      </div>
    </Flatten>
  );
}
