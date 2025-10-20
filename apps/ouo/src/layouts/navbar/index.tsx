import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";
import ThemeButton from "./theme-button";
import LangButton from "./lang-button";
import type { Lang } from "@/utils/i18n/config";
import { cn } from "@/utils/cn";
import CardLabel from "@/components/card/label";
import { IoPeople } from "react-icons/io5";

export default function Navbar({ lang }: { lang: Lang }) {
  return (
    <nav className={cn("container *:px-4 md:*:px-6")}>
      <div
        className={cn(
          "flex items-center min-h-16 gap-4 card mt-2 bg-primary-500/10 rounded-full backdrop-blur-2xl",
        )}
      >
        <Link to={`/${lang}`} className="text-lg font-bold">
          <Image src={setting.avatar} className="rounded-full size-8" />
        </Link>
        <CardLabel className="px-0 h-7 w-12 mx-auto md:mx-0">
          <IoPeople size={16} className="" />
        </CardLabel>
        <div className="mx-auto md:mx-0 md:ml-auto flex">
          <LangButton />
        </div>
        <ThemeButton />
      </div>
    </nav>
  );
}
