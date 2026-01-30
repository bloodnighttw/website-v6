import Card from "@/components/card";
import { cn } from "@/utils/cn";

import type { PJ } from "../../../vite.config";
import type { Lang } from "@/contexts/i18n";
import { TechStackIcon } from "@/components/tech-stack-icon";
import { HiExternalLink } from "react-icons/hi";
import { createTranslate } from "@/utils/i18n/server";

import * as stylex from "@stylexjs/stylex";

interface MetaProps {
  metadata: PJ;
  lang: Lang;
}

const styles = stylex.create({
  card: {
    padding: "1.5rem",
    marginBottom: "2rem",
  },
});

export default async function Meta({ metadata, lang }: MetaProps) {
  const t = await createTranslate(lang);

  return (
    <Card
      className={cn("p-6 mb-8", "bg-secondary-500/5")}
      {...stylex.props(styles.card)}
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

          {metadata.stack && metadata.stack.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {metadata.stack.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg",
                      "bg-primary-500/10 text-primary-900 dark:text-primary-100",
                      "border border-primary-500/30",
                      "transition-colors duration-200",
                      "hover:bg-primary-500/20",
                    )}
                  >
                    <TechStackIcon tech={tech} size={18} />
                  </span>
                ))}
              </div>
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
  );
}
