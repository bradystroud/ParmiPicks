import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { FaBars, FaTimes, FaUtensils } from "react-icons/fa";
import Link from "next/link";

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
      "transition-colors duration-200 ease-out font-semibold";
    const desktopClasses = isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:bg-amber-100/70 hover:text-slate-900";
    const mobileClasses = isActive
      ? "bg-slate-900/90 text-white"
      : "text-slate-700 hover:bg-amber-100/80";

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
    <header className="relative">
      <div
        className="pointer-events-none absolute inset-0 h-48 bg-gradient-to-b from-amber-100/70 via-white to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl"
        aria-hidden="true"
      />
      <Container size="custom" className="relative z-10 max-w-6xl py-6">
        <nav className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6 rounded-3xl border border-white/60 bg-white/80 px-6 py-4 shadow-lg shadow-amber-100/70 backdrop-blur">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-bold text-slate-900"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white shadow-inner">
                <FaUtensils className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="tracking-tight">Parmi Picks</span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item, index) => renderNavItem(item, index))}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-slate-600 transition hover:bg-white md:hidden"
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
          </div>

          {expanded && (
            <div className="md:hidden rounded-3xl border border-white/60 bg-white/80 px-6 py-5 shadow-lg shadow-amber-100/70 backdrop-blur">
              <div className="flex flex-col gap-3">
                {navItems.map((item, index) => renderNavItem(item, index, true))}
              </div>
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
};
