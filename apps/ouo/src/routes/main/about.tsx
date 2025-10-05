import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "rpress/image";
import CONFIG from "@/config/config.json";

async function About() {
  const birthData = new Date(CONFIG.birth);
  const range = Date.now() - birthData.getTime();
  const age = Math.floor(range / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <div className="flex my-16">
      {/*left side*/}
      <div className="flex flex-col flex-1">
        <p>{"👋 hi！"}</p>
        <h1 className="text-6xl font-bold mt-1">{"I'm Bloodnighttw"}</h1>
        <p className="font-mono mt-1">{`${age} y/o • Developer • Gamer`}</p>
        <p className="mt-1 text-lg">{`A frontend developer from Earth.`}</p>
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
