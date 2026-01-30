import Card from "@/components/card";
import CardLabel from "@/components/card/label";
import Link from "rpress/link";
import type { Lang } from "@/utils/i18n/config";
import { blogSource } from "@/utils/source";
import { createTranslate } from "@/utils/i18n/server";
import Image from "rpress/image";
import * as stylex from "@stylexjs/stylex";
import { colors, spacing, radius, fontSize } from "@/styles/tokens.stylex";

const styles = stylex.create({
  labelContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: spacing.xl,
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
  date: {
    fontSize: fontSize.sm,
    color: {
      default: colors.secondary600,
      ":is(.dark *)": colors.secondary400,
    },
  },
  categories: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  category: {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    fontSize: fontSize.xs,
    backgroundColor: {
      default: colors.secondary100,
      ":is(.dark *)": colors.secondary800,
    },
    color: {
      default: colors.secondary700,
      ":is(.dark *)": colors.secondary300,
    },
    borderRadius: radius.md,
  },
});

async function Blog({ lang }: { lang: Lang }) {
  const t = await createTranslate(lang);
  let blogModules = blogSource.entriesWithLang(lang);

  const blogs = Object.entries(blogModules).map(([slug, mod]) => ({
    slug,
    ...mod.zod,
    preview: mod.preview,
  }));

  // Sort blogs by date (newest first)
  const sortedBlogs = blogs.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <div {...stylex.props(styles.labelContainer)}>
        <CardLabel>{t("blog.title")}</CardLabel>
      </div>
      <div {...stylex.props(styles.grid)}>
        {sortedBlogs.map((blog) => (
          <Link key={blog.slug} to={`/${lang}/blog/${blog.slug}`}>
            <Card {...stylex.props(styles.card)}>
              <div {...stylex.props(styles.imageContainer)}>
                <Image
                  src={blog.preview ?? "/default.png"}
                  alt={blog.title}
                  {...stylex.props(styles.image)}
                  height={353}
                  width={628}
                />
              </div>

              <div {...stylex.props(styles.content)}>
                <h3 {...stylex.props(styles.title)}>{blog.title}</h3>
                <p {...stylex.props(styles.date)}>
                  {new Date(blog.date).toLocaleDateString(
                    lang === "zh" ? "zh-TW" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              {blog.categories && blog.categories.length > 0 && (
                <div {...stylex.props(styles.categories)}>
                  {blog.categories.map((category) => (
                    <span key={category} {...stylex.props(styles.category)}>
                      {category}
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

export default Blog;
