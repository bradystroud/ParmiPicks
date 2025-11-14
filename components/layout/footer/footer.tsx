import React from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Container } from "../../util/container";

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
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:-translate-y-1 hover:bg-white/20"
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
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 right-12 h-72 w-72 rounded-full bg-orange-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col gap-10 py-12 md:flex-row md:items-center md:justify-between" size="large">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">
            Parmi Picks
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Sharing the tastiest chicken parmigiana around Australia.
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Made with ❤️ by{" "}
            <a
              className="text-slate-100 underline decoration-amber-400/60 decoration-2 underline-offset-4 transition hover:text-amber-200"
              href="https://github.com/bradystroud"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brady Stroud
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 text-sm text-slate-300 md:items-end">
          <p className="font-semibold text-slate-200">Stay in the loop</p>
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
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Parmi Picks. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
