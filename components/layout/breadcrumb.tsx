// /components/NextBreadcrumb.tsx
"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

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
  const separator = <span className="mx-2">/</span>;
  return (
    pathNames.length > 0 && (
      <div className="mx-20">
        <ul className="flex py-5">
          <li className="hover:opacity-70 hover:underline mx-2">
            <Link href={"/"}>
              <FaHome className="mt-1" />
            </Link>
          </li>
          {pathNames.length > 0 && separator}
          {pathNames.map((link, index) => {
            const href = `/${pathNames.slice(0, index + 1).join("/")}`;
            const itemClasses =
              paths === href
                ? "opacity-70 cursor-default"
                : "hover:opacity-70 hover:underline";
            return (
              <React.Fragment key={index}>
                <li className="mx-2">
                  <Link className={itemClasses} href={href}>
                    {cleanUpLink(link)}
                  </Link>
                </li>
                {pathNames.length !== index + 1 && separator}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default NextBreadcrumb;
