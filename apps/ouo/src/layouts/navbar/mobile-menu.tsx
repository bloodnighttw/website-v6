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
        className="md:hidden w-6 cursor-pointer mr-2 relative h-6 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <HiMenu
          size={24}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isOpen
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100",
          )}
        />
        <HiX
          size={24}
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0",
          )}
        />
      </button>

      {isOpen &&
        createPortal(
          <>
            <div
              className={cn(
                "absolute top-full left-0 my-4 right-0 mx-6",
                "card bg-primary-500/10 backdrop-blur-2xl rounded-2xl",
                "flex flex-col gap-2 p-2",
                "md:hidden",
              )}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Link
                to={`/${lang}`}
                className="text-lg px-4 py-2 hover:bg-primary-500/20 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                friends link
              </Link>
              <Link
                to={`/${lang}`}
                className="text-lg px-4 py-2 hover:bg-primary-500/20 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                blog
              </Link>
              <hr className="border-primary-500/20 mt-2" />
              <div className="flex items-center gap-4 mt-2 px-2 pb-4">
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
