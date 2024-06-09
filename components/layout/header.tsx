import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "../util/container";
import {
  FaBars,
  FaSearchLocation,
  FaTimes,
  FaUtensils,
  FaWaveSquare,
} from "react-icons/fa";
import Link from "next/link";

export const Header = ({ data }) => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefix, setPrefix] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (window && window.location.pathname.startsWith("/admin")) {
      setPrefix("/admin");
    }
  }, [expanded]);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b`}>
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <nav className="flex items-center justify-between flex-wrap p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <FaSearchLocation className="fill-current h-8 w-8 mr-2" />{" "}
            {/* Weird stuff happens when i removed the above line, so it stays */}
            <span className="font-semibold text-xl tracking-tight text-black ">
              <Link href="/" className="flex">
                <FaWaveSquare className="fill-current h-8 w-8 mr-2" />
                Parmi Picks
              </Link>
            </span>
          </div>
          <div className="block md:hidden">
            <button
              className="flex items-center px-3 py-2 text-teal-20 hover:text-gray-400"
              aria-label="menu"
            >
              {expanded ? (
                <FaTimes onClick={() => setExpanded(!expanded)} />
              ) : (
                <FaBars onClick={() => setExpanded(!expanded)} />
              )}
            </button>
          </div>
          <div
            className={`w-full block md:items-center md:w-auto ${
              expanded ? "" : "hidden md:flex"
            }`}
          >
            <div className="text-sm lg:flex-grow mx-10">
              {data.nav &&
                data.nav.map((item, i) => {
                  const activeItem =
                    item.href === ""
                      ? router.asPath === "/"
                      : router.asPath.includes(item.href);

                  return (
                    <Link
                      key={i}
                      href={"/" + item.href}
                      className={`block mt-4 md:inline-block md:mt-0 hover:text-blue-600 mr-4 ${
                        activeItem ? "opacity-50" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        </nav>
        <div
          className={`absolute h-1 bg-gradient-to-r from-transparent via-black to-transparent bottom-0 left-4 right-4 -z-1 opacity-5`}
        />
      </Container>
    </div>
  );
};
