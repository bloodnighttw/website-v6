import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";
import ThemeButton from "./theme-button";
import LangButton from "./lang-button";
import MobileMenu from "./mobile-menu";
import type { Lang } from "@/utils/i18n/config";
import { cn } from "@/utils/cn";

export default function Navbar({ lang }: { lang: Lang }) {
  return (
    <>
      <nav className={cn("container *:px-4 md:*:px-6 sticky top-2")}>
        <div
          className={cn(
            "flex items-center min-h-16 gap-4 card mt-2 bg-primary-500/10 rounded-full backdrop-blur-2xl",
          )}
        >
          <Link to={`/${lang}`} className="text-lg font-bold">
            <Image src={setting.avatar} className="rounded-full size-8" />
          </Link>
          <div className="mx-auto flex gap-4 text-lg underline not-md:hidden">
            <Link to={`/${lang}`} className="flex-1 text-lg mx-auto">
              friends link
            </Link>
            <Link to={`/${lang}`}>blog</Link>
          </div>
          <div className="mx-auto md:mx-0 flex not-md:hidden">
            <LangButton />
          </div>
          <div className="not-md:hidden">
            <ThemeButton />
          </div>
          <div className="mx-auto md:hidden" />
          <MobileMenu lang={lang} />
        </div>
      </nav>
      <div id="menu" className="sticky top-18 w-full" />
    </>
  );
}
