import React from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Container } from "../../util/container";
import Image from "next/image";

export const Footer = ({ data }) => {
  const social = data?.social ?? {};

  const SocialLink = ({
    href,
    label,
    children,
  }: {
    href?: string | null;
    label: string;
    children: React.ReactNode;
  }) => {
    if (!href) {
      return null;
    }

    const isRelative = href.startsWith("/");
    const resolvedHref = isRelative ? `https://parmipicks.com${href}` : href;

    return (
      <a
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-white text-[#d85530] transition hover:-translate-y-1 hover:bg-[#fff3ee]"
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {children}
      </a>
    );
  };

  return (
    <footer className="bg-[#d85530] text-white">
      <Container
        className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between"
        size="large"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#d85530] p-1 overflow-hidden">
              <Image 
                src="/parmi-picks-logo.svg" 
                alt="Parmi Picks Logo" 
                width={40} 
                height={40}
                className="h-10 w-10"
              />
            </span>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Parmi Picks
            </p>
          </div>
          <p className="max-w-md text-sm text-white/85">
            Sharing the tastiest chicken parmigiana around Australia.
          </p>
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Parmi Picks. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 text-sm md:items-end">
          <p className="font-semibold uppercase tracking-[0.2em] text-white/80">
            Stay in the loop
          </p>
          <div className="flex items-center gap-3">
            <SocialLink href={social.twitter} label="Twitter">
              <FaTwitter className="h-5 w-5" aria-hidden="true" />
            </SocialLink>
            <SocialLink href={social.instagram} label="Instagram">
              <AiFillInstagram className="h-6 w-6" aria-hidden="true" />
            </SocialLink>
            <SocialLink href={social.github} label="GitHub">
              <FaGithub className="h-5 w-5" aria-hidden="true" />
            </SocialLink>
          </div>
        </div>
      </Container>
    </footer>
  );
};
