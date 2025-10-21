"use client";

import { useEffect, useRef, useState } from "react";
import Link from "rpress/link";
import { cn } from "@/utils/cn";
import { HiMenu, HiX } from "react-icons/hi";
import type { Lang } from "@/utils/i18n/config";
import LangButton from "./lang-button";
import ThemeButton from "./theme-button";
import { createPortal } from "react-dom";

export default function MobileMenu({ lang }: { lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const ref = useRef<HTMLDivElement | null>(null);

  // if click outside of the menu, close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden w-6 cursor-pointer mr-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              className={cn(
                "absolute top-full left-0 my-4 right-0 mx-6",
                "card bg-primary-500/10 backdrop-blur-2xl rounded-2xl",
                "flex flex-col gap-2 px-2 py-4",
                "md:hidden",
              )}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Link
                to={`/${lang}`}
                className="text-lg px-4 hover:bg-primary-500/20 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                friends link
              </Link>
              <Link
                to={`/${lang}`}
                className="text-lg px-4 hover:bg-primary-500/20 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                blog
              </Link>
              <hr className="border-primary-500/20 mt-2" />
              <div className="flex items-center gap-4 mt-2 px-2">
                <span className="text-sm opacity-70">Settings:</span>
                <LangButton />
                <ThemeButton />
              </div>
            </div>
          </>,
          document.getElementById("menu")!,
        )}
    </>
  );
}
