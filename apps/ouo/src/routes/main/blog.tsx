import Card from "@/components/card";
import CardLabel from "@/components/card/label";
import Link from "rpress/link";
import type { Lang } from "@/utils/i18n/config";
import { blogSource } from "@/utils/source";
import { createTranslate } from "@/utils/i18n/server";
import { cn } from "@/utils/cn";
import Image from "rpress/image";

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
      <div className="flex justify-center mt-8">
        <CardLabel>{t("blog.title")}</CardLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {sortedBlogs.map((blog) => (
          <Link key={blog.slug} to={`/${lang}/blog/${blog.slug}`}>
            <Card
              className={cn(
                "p-4 h-full cursor-pointer",
                "hover:bg-secondary-500/10",
                "transition-colors duration-200",
                "flex flex-col gap-4",
              )}
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800">
                <Image
                  src={blog.preview ?? "/default.png"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  height={353}
                  width={628}
                />
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{blog.title}</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
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
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-md"
                    >
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
