import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export const Header = ({ data }) => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefix, setPrefix] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      setPrefix("/admin");
    }
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [router.asPath]);

  const navItems = data?.nav ?? [];

  const renderNavItem = (item, index: number, mobile = false) => {
    const href = `/${item.href ?? ""}`.replace(/\/+/g, "/");
    const isActive =
      item.href === ""
        ? router.asPath === "/"
        : router.asPath.replace(/\/$/, "").includes(item.href);

    const baseClasses =
      "transition-colors duration-200 ease-out text-sm font-semibold uppercase tracking-[0.2em]";
    const desktopClasses = isActive
      ? "bg-white text-[#d85530] shadow-sm"
      : "text-white/90 hover:text-white";
    const mobileClasses = isActive
      ? "bg-white text-[#d85530]"
      : "text-white/90 hover:bg-white/10";

    return (
      <Link
        key={index}
        href={href}
        className={`rounded-full px-4 py-2 ${baseClasses} ${
          mobile ? mobileClasses : desktopClasses
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="bg-[#d85530] text-white">
      <Container size="custom" className="max-w-6xl py-5">
        <nav className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-4">
            <Image 
                  src="/parmi-picks-logo.svg" 
                  alt="Parmi Picks Logo" 
                  width={44} 
                  height={44}
                  className="h-11 w-11"
                />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item, index) => renderNavItem(item, index))}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label="Toggle navigation menu"
          >
            {expanded ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>
        </nav>

        {expanded && (
          <div className="mt-4 rounded-3xl border border-white/30 bg-white/10 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => renderNavItem(item, index, true))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
