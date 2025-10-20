import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "rpress/image";
import CONFIG from "@/config/config.json";
import type { Lang } from "@/utils/i18n/config";
import { createTranslate } from "@/utils/i18n/server";
import { cn } from "@/utils/cn";

async function About({ lang }: { lang: Lang }) {
  const t = await createTranslate(lang);
  const birthData = new Date(CONFIG.birth);
  const range = Date.now() - birthData.getTime();
  const age = Math.floor(range / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <div className="flex my-16">
      {/*left side*/}
      <div className="flex flex-col flex-1">
        <p>{t("about.greeting")}</p>
        <h1 className="text-6xl font-bold mt-1">{t("about.name")}</h1>
        <p className="font-mono mt-1">{`${age} y/o • ${t("about.role")}`}</p>
        <p className="mt-1 text-lg">{t("about.description")}</p>
        <div
          className={cn(
            "mt-auto flex gap-8 *:size-6 *:cursor-pointer",
            "dark:*:fill-primary-300 dark:*:hover:fill-primary-50 *:duration-200",
            "*:fill-primary-700 *:hover:fill-primary-950",
          )}
        >
          <FaGithub />
          <FaTwitter />
          <FaTelegram />
          <FaDiscord />
          <IoMail />
        </div>
      </div>
      <div className="flex items-center">
        <Image
          src={CONFIG.avatar}
          className="rounded-full size-48 shadow shadow-primary-500/20"
        />
      </div>
    </div>
  );
}

export default About;
