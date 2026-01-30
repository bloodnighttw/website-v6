import Card from "@/components/card";
import CardLabel from "@/components/card/label";
import Link from "rpress/link";
import type { Lang } from "@/utils/i18n/config";
import { pjSource } from "@/utils/source";
import { createTranslate } from "@/utils/i18n/server";
import { TechStackIcon } from "@/components/tech-stack-icon";
import Image from "rpress/image";
import * as stylex from "@stylexjs/stylex";
import { colors, spacing, radius, fontSize } from "@/styles/tokens.stylex";

const styles = stylex.create({
  labelContainer: {
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 768px)": "repeat(2, 1fr)",
      "@media (min-width: 1024px)": "repeat(3, 1fr)",
    },
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  card: {
    padding: spacing.md,
    height: "100%",
    cursor: "pointer",
    backgroundColor: {
      ":hover": "rgba(120, 113, 108, 0.1)",
    },
    transitionProperty: "background-color",
    transitionDuration: "200ms",
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: {
      default: colors.secondary100,
      ":is(.dark *)": colors.secondary800,
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 700,
  },
  description: {
    fontSize: fontSize.sm,
    color: {
      default: colors.secondary700,
      ":is(.dark *)": colors.secondary300,
    },
  },
  stackContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.625rem",
  },
  stackItem: {
    color: {
      default: colors.secondary600,
      ":is(.dark *)": colors.secondary400,
    },
    opacity: 0.7,
    transitionProperty: "opacity",
    transitionDuration: "200ms",
    ":hover": {
      opacity: 1,
    },
  },
});

async function Project({ lang }: { lang: Lang }) {
  const t = await createTranslate(lang);
  const projectModules = pjSource.getByLang(lang);
  const projects = Object.entries(projectModules).map(([slug, mod]) => ({
    slug,
    ...mod.zod,
  }));

  return (
    <>
      <div {...stylex.props(styles.labelContainer)}>
        <CardLabel>{t("projects.title")}</CardLabel>
      </div>
      <div {...stylex.props(styles.grid)}>
        {projects.map((project) => (
          <Link key={project.slug} to={`/${lang}/projects/${project.slug}`}>
            <Card {...stylex.props(styles.card)}>
              <div {...stylex.props(styles.imageContainer)}>
                <Image
                  src={project.thumbnail}
                  alt={project.name}
                  {...stylex.props(styles.image)}
                />
              </div>

              <div {...stylex.props(styles.content)}>
                <h3 {...stylex.props(styles.title)}>{project.name}</h3>
                <p {...stylex.props(styles.description)}>
                  {project.description}
                </p>
              </div>

              {project.stack && project.stack.length > 0 && (
                <div {...stylex.props(styles.stackContainer)}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      {...stylex.props(styles.stackItem)}
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
