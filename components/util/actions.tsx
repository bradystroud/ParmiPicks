import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";

export const Actions = ({ parentField = "", className = "", actions }) => {
  return (
    <div className={`flex flex-wrap items-center gap-y-4 gap-x-6 ${className}`}>
      {actions &&
        actions.map(function (action, index) {
          let element = null;
          if (action.type === "button") {
            element = (
              <Link
                key={index}
                href={action.link ? action.link : "/"}
                data-tinafield={`${parentField}.${index}`}
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span>{action.label}</span>
                {action.icon && (
                  <BiRightArrowAlt
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          }
          if (action.type === "link" || action.type === "linkExternal") {
            const href = action.link ? action.link : "/";
            const isExternal = action.type === "linkExternal" || href.startsWith("http");

            const linkContent = (
              <span className="group inline-flex items-center gap-2">
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                )}
              </span>
            );

            element = isExternal ? (
              <a
                key={index}
                href={href}
                data-tinafield={`${parentField}.${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-brand bg-white px-6 py-3 text-sm font-semibold text-brand shadow-sm shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-tint"
              >
                {linkContent}
              </a>
            ) : (
              <Link
                key={index}
                href={href}
                data-tinafield={`${parentField}.${index}`}
                className="rounded-full border-2 border-brand bg-white px-6 py-3 text-sm font-semibold text-brand shadow-sm shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-tint"
              >
                {linkContent}
              </Link>
            );
          }
          return element;
        })}
    </div>
  );
};
