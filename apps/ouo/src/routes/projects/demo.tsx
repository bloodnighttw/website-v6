import Card from "@/components/card";
import type { Lang } from "@/contexts/i18n";
import { cn } from "@/utils/cn";
import { createTranslate } from "@/utils/i18n/server";
import { HiExternalLink } from "react-icons/hi";

interface DemoProps {
  demo?: string;
  lang: Lang;
}

export default async function Demo({ demo, lang }: DemoProps) {
  if (!demo) return null;

  const t = await createTranslate(lang);

  return (
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
          href={demo}
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
            src={demo}
            className="w-full h-full rounded-lg"
            title={"Live Demo"}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      </div>
    </Card>
  );
}
