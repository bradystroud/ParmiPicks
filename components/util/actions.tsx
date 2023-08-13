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
              <Link key={index} href={action.link ? action.link : "/"}>
                <button
                  data-tinafield={`${parentField}.${index}`}
                  className={`z-10 relative flex items-center px-7 py-3 font-semibold text-lg transition duration-150 ease-out rounded-lg transform focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 whitespace-nowrap`}
                >
                  {action.label}
                  {action.icon && (
                    <BiRightArrowAlt
                      className={`ml-1 -mr-1 w-6 h-6 opacity-80`}
                    />
                  )}
                </button>
              </Link>
            );
          }
          if (action.type === "link" || action.type === "linkExternal") {
            element = (
              <Link key={index} href={action.link ? action.link : "/"} passHref>
                <a
                  data-tinafield={`${parentField}.${index}`}
                  className={`group inline-flex items-center font-semibold text-lg transition duration-150 ease-out`}
                  style={{
                    textShadow: `0 3px 7px rgba(var(--color-rgb-blue-400),0.2)`,
                  }}
                >
                  {action.label}
                  {action.icon && (
                    <BiRightArrowAlt
                      className={`ml-0 mr-0 w-6 h-6 opacity-80`}
                    />
                  )}
                </a>
              </Link>
            );
          }
          return element;
        })}
    </div>
  );
};
