import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";

export default function Navbar() {
  return (
    <nav className="container sticky top-0 w-screen xl:w-full xl:top-2 xl:mt-2 bg-primary-500/10 xl:rounded-xl backdrop-blur-2xl">
      <div className="flex items-center h-16 gap-2 ">
        <Image
          src={setting.avatar}
          width={32}
          height={32}
          className="rounded-full"
        />
        <Link to="/" className="text-lg font-bold">
          Bloodnighttw's Workshop
        </Link>
      </div>
    </nav>
  );
}
