import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "rpress/image";
import CONFIG from "@/config/config.json";
import type { Lang } from "@/utils/i18n/config";
import { createTranslate } from "@/utils/i18n/server";

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
        <div className="mt-auto flex gap-8 *:size-6 *:cursor-pointer *:opacity-70 *:hover:opacity-100 *:transition-opacity *:duration-200">
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
