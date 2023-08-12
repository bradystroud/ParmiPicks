import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { useTheme } from ".";
import { FaBars, FaSearchLocation } from "react-icons/fa";

export const Header = ({ data }) => {
  const router = useRouter();
  const theme = useTheme();

  const headerColor = {
    default:
      "text-black dark:text-white from-gray-50 to-white dark:from-gray-800 dark:to-gray-900",
    primary: {
      blue: "text-white from-blue-300 to-blue-500",
      teal: "text-white from-teal-400 to-teal-500",
      green: "text-white from-green-400 to-green-500",
      red: "text-white from-red-400 to-red-500",
      pink: "text-white from-pink-400 to-pink-500",
      purple: "text-white from-purple-400 to-purple-500",
      orange: "text-white from-orange-400 to-orange-500",
      yellow: "text-white from-yellow-400 to-yellow-500",
    },
  };

  const headerColorCss =
    data.color === "primary"
      ? headerColor.primary[theme.color]
      : headerColor.default;

  // If we're on an admin path, other links should also link to their admin paths
  const [prefix, setPrefix] = useState("");
  const [expanded, setExpanded] = useState(false);

  React.useEffect(() => {
    if (window && window.location.pathname.startsWith("/admin")) {
      setPrefix("/admin");
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b ${headerColorCss}`}
    >
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <nav className="flex items-center justify-between flex-wrap p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <FaSearchLocation className="fill-current h-8 w-8 mr-2" />
            <span className="font-semibold text-xl tracking-tight">
              Parmi Picks
            </span>
          </div>
          <div className="block md:hidden">
            <button className="flex items-center px-3 py-2 text-teal-20 hover:text-white">
              <FaBars onClick={() => setExpanded(!expanded)} />
            </button>
          </div>
          <div
            className={`w-full block flex-grow md:items-center md:w-auto ${
              expanded ? "" : "hidden md:flex"
            }`}
          >
            <div className="text-sm lg:flex-grow">
              {data.nav &&
                data.nav.map((item, i) => {
                  const activeItem =
                    item.href === ""
                      ? router.asPath === "/"
                      : router.asPath.includes(item.href);

                  return (
                    <a
                      key={i}
                      href={"/" + item.href}
                      className={`block mt-4 md:inline-block md:mt-0 text-blue-200 hover:text-white mr-4 ${
                        activeItem ? "opacity-50" : ""
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
            </div>
          </div>
        </nav>
        <div
          className={`absolute h-1 bg-gradient-to-r from-transparent ${
            data.color === "primary" ? `via-white` : `via-black dark:via-white`
          } to-transparent bottom-0 left-4 right-4 -z-1 opacity-5`}
        />
      </Container>
    </div>
  );
};
