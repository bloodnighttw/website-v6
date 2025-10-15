import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";
import ThemeButton from "./theme-button";
import LangButton from "./lang-button";
import type { Lang } from "@/contexts/i18n";

export default function Navbar({ lang }: { lang: Lang }) {
  return (
    <nav className="container sticky top-0 w-screen xl:w-full xl:top-2 xl:mt-2 xl:card bg-primary-500/10 xl:rounded-xl backdrop-blur-2xl">
      <div className="flex items-center h-16 gap-2 ">
        <Image src={setting.avatar} className="rounded-full size-8" />
        <Link to={`/${lang}`} className="text-lg font-bold">
          Bloodnighttw's Workshop
        </Link>
        <div className="mx-auto" />
        <LangButton />
        <ThemeButton />
      </div>
    </nav>
  );
}
