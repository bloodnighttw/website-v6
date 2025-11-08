import Card from "@/components/card";
import { cn } from "@/utils/cn";

import type { Blog } from "../../../vite.config";
import type { Lang } from "@/contexts/i18n";
import { createTranslate } from "@/utils/i18n/server";

interface MetaProps {
  metadata: Blog;
  lang: Lang;
  isExactMatch: boolean;
}

export default async function Meta({
  metadata,
  lang,
  isExactMatch,
}: MetaProps) {
  const t = await createTranslate(lang);

  return (
    <>
      {!isExactMatch && (
        <Card
          className={cn(
            "p-4 mb-4",
            "bg-yellow-500/10 border border-yellow-500/30",
          )}
        >
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            ⚠️ {t("content.notTranslated")}
          </p>
        </Card>
      )}

      <Card className={cn("p-6 mb-8", "bg-secondary-500/5")}>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
              {metadata.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400">
            <time dateTime={metadata.date}>{metadata.date}</time>
          </div>

          {metadata.categories && metadata.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.categories.map((category) => (
                <span
                  key={category}
                  className={cn(
                    "inline-flex items-center px-3 py-1.5 text-sm rounded-lg",
                    "bg-primary-500/10 text-primary-900 dark:text-primary-100",
                    "border border-primary-500/30",
                    "transition-colors duration-200",
                    "hover:bg-primary-500/20",
                  )}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
