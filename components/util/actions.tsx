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
                className="group inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span>{action.label}</span>
                {action.icon && (
                  <BiRightArrowAlt
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  />
                )}
              </Link>
            );
          }
          if (action.type === "link" || action.type === "linkExternal") {
            const href = action.link ? action.link : "/";
            const isExternal = action.type === "linkExternal" || href.startsWith("http");

            const linkContent = (
              <span className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900">
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
                className="rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-amber-50/80"
              >
                {linkContent}
              </a>
            ) : (
              <Link
                key={index}
                href={href}
                data-tinafield={`${parentField}.${index}`}
                className="rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-amber-50/80"
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
