import React, { useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import { FaBars, FaSearchLocation } from "react-icons/fa";

export const Header = ({ data }) => {
  const router = useRouter();

  // If we're on an admin path, other links should also link to their admin paths
  const [prefix, setPrefix] = useState("");
  const [expanded, setExpanded] = useState(false);

  React.useEffect(() => {
    if (window && window.location.pathname.startsWith("/admin")) {
      setPrefix("/admin");
    }
  }, []);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b`}>
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <nav className="flex items-center justify-between flex-wrap p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <FaSearchLocation className="fill-current h-8 w-8 mr-2" />
            <span className="font-semibold text-xl tracking-tight text-black">
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
                      className={`block mt-4 md:inline-block md:mt-0 hover:text-blue-600 mr-4 ${
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
