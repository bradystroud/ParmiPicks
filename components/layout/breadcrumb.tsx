// /components/NextBreadcrumb.tsx
"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Container } from "../util/container";

const replacements: Record<string, string> = {
  EmbassyBarKitchen: "Embassy Bar & Kitchen",
  SBBG: "South Bank Beer Garden",
};

function cleanUpLink(link: string) {
  if (replacements[link]) {
    return replacements[link];
  } else {
    return link
      .split("-")
      .map((word) => {
        if (word === "and" || word === "or" || word === "the") {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      })
      .join(" ");
  }
}

const NextBreadcrumb = () => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  if (pathNames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="relative">
      <Container size="custom" className="max-w-6xl py-6">
        <ol className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-5 py-3 text-sm font-medium text-slate-500 shadow-sm shadow-slate-200/60 backdrop-blur">
          <li>
            <Link
              href={"/"}
              aria-label="Go to home page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition hover:bg-amber-200"
            >
              <FaHome className="h-4 w-4" aria-hidden="true" />
            </Link>
          </li>
          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathNames.length - 1;
            const itemClasses = isLast
              ? "text-slate-700"
              : "text-slate-500 hover:text-slate-800";

            return (
              <React.Fragment key={href}>
                <li aria-hidden="true" className="text-slate-300">
                  /
                </li>
                <li>
                  {isLast ? (
                    <span className="rounded-full bg-transparent px-2 py-1">{cleanUpLink(link)}</span>
                  ) : (
                    <Link
                      className={`rounded-full px-2 py-1 transition ${itemClasses}`}
                      href={href}
                    >
                      {cleanUpLink(link)}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
};

export default NextBreadcrumb;
