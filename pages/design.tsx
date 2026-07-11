import React from "react";
import Head from "next/head";

/**
 * Hidden internal design-system reference for Parmi Picks.
 *
 * Not linked in the nav, noindex'd, and excluded from the sitemap — it exists so
 * we have one place to look up design tokens and spot inconsistencies. If you add
 * a new token or component pattern, document it here too.
 */

const brand = {
  DEFAULT: "#d85530",
  tint: "#fff3ee",
  hover: "#c84e2d",
  hoverAlt: "#c04a28",
};

const grayScale = {
  50: "#F6F6F9",
  100: "#EDECF3",
  150: "#E6E3EF",
  200: "#E1DDEC",
  250: "#C9C5D5",
  300: "#b2adbe",
  400: "#918c9e",
  500: "#716c7f",
  600: "#565165",
  700: "#433e52",
  800: "#363145",
  900: "#252336",
  1000: "#1c1b2e",
};

const blueScale = {
  50: "#DCEEFF",
  100: "#B4DBFF",
  200: "#85C5FE",
  300: "#4EABFE",
  400: "#2296fe",
  500: "#0084FF",
  600: "#0574e4",
  700: "#0D5DBD",
  800: "#144696",
  900: "#1D2C6C",
  1000: "#241748",
};

const orangeScale = {
  200: "#EB7752",
  300: "#EA6C45",
  400: "#E85C30",
  500: "#EC4815",
  600: "#DC4419",
  700: "#D04017",
  800: "#C1360F",
};

const typeScale: [string, string][] = [
  ["xs", ".875rem"],
  ["sm", "1rem"],
  ["base", "1.125rem"],
  ["lg", "1.25rem"],
  ["xl", "1.5rem"],
  ["2xl", "1.75rem"],
  ["3xl", "2rem"],
  ["4xl", "2.5rem"],
  ["5xl", "3.25rem"],
  ["6xl", "4rem"],
  ["7xl", "5rem"],
  ["8xl", "6rem"],
];

const breakpoints: [string, string][] = [
  ["sm", "600px"],
  ["md", "900px"],
  ["lg", "1200px"],
  ["xl", "1500px"],
  ["2xl", "1800px"],
];

const radii: [string, string][] = [
  ["rounded-lg", "0.5rem"],
  ["rounded-xl", "0.75rem"],
  ["rounded-2xl", "1rem"],
  ["rounded-3xl", "1.5rem"],
  ["rounded-[2.5rem]", "2.5rem"],
  ["rounded-full", "9999px"],
];

const Swatch = ({
  name,
  value,
  note,
}: {
  name: string;
  value: string;
  note?: string;
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="h-16 w-full rounded-xl border border-black/5 shadow-sm"
      style={{ backgroundColor: value }}
    />
    <div className="leading-tight">
      <p className="text-sm font-semibold text-slate-800">{name}</p>
      <p className="font-mono text-xs uppercase text-slate-500">{value}</p>
      {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
    </div>
  </div>
);

const ScaleRow = ({
  label,
  scale,
  aliasNote,
}: {
  label: string;
  scale: Record<string | number, string>;
  aliasNote?: string;
}) => (
  <div>
    <div className="mb-2 flex items-baseline gap-3">
      <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
      {aliasNote && <p className="text-xs text-slate-500">{aliasNote}</p>}
    </div>
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
      {Object.entries(scale).map(([step, value]) => (
        <div key={step} className="flex flex-col gap-1.5">
          <div
            className="h-12 w-full rounded-lg border border-black/5"
            style={{ backgroundColor: value }}
          />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-slate-700">{step}</p>
            <p className="font-mono text-[10px] uppercase text-slate-400">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SectionBlock = ({
  id,
  title,
  children,
  intro,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 border-t border-slate-200 py-12">
    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
    {intro && <p className="mt-2 max-w-2xl text-base text-slate-600">{intro}</p>}
    <div className="mt-8">{children}</div>
  </section>
);

const Pill = ({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) => (
  <span
    className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] ${
      active ? "bg-white text-brand shadow-sm" : "text-white/90"
    }`}
  >
    {children}
  </span>
);

export default function DesignSystemPage() {
  const nav = [
    ["colors", "Colours"],
    ["type", "Typography"],
    ["layout", "Layout & spacing"],
    ["buttons", "Buttons"],
    ["components", "Components"],
    ["inconsistencies", "Cleanups"],
  ];

  return (
    <>
      <Head>
        <title>Design System — Parmi Picks (internal)</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        {/* Header */}
        <header className="bg-brand text-white">
          <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Internal · not in the menu
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
              Parmi Picks Design System
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/85">
              The living reference for the colours, type, and components that make
              up the site. A place to look up tokens — and to catch the things that
              have drifted out of line.
            </p>
            <nav className="mt-6 flex flex-wrap gap-2">
              {nav.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
          {/* COLOURS */}
          <SectionBlock
            id="colors"
            title="Colours"
            intro="Brand orange is the identity of the site. Everything else is a supporting neutral or accent."
          >
            <div className="space-y-10">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Brand
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Swatch
                    name="brand.DEFAULT"
                    value={brand.DEFAULT}
                    note="Header, footer, buttons, cards"
                  />
                  <Swatch
                    name="brand.tint / 50"
                    value={brand.tint}
                    note="On-brand button bg, light hover"
                  />
                  <Swatch
                    name="brand.600"
                    value={brand.hover}
                    note="Primary button hover"
                  />
                  <Swatch
                    name="brand.700"
                    value={brand.hoverAlt}
                    note="Deep hover / active"
                  />
                </div>
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  These now have a Tailwind token:{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                    bg-brand
                  </code>
                  ,{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                    text-brand
                  </code>
                  ,{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                    border-brand
                  </code>
                  . Prefer them over raw{" "}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                    #d85530
                  </code>
                  .
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-lg font-semibold text-slate-900">
                  Amber — warm secondary accent
                </h3>
                <p className="mb-3 max-w-2xl text-sm text-slate-600">
                  Tailwind&apos;s default amber, used as a warm supporting layer:
                  soft card shadows (<code className="font-mono text-xs">shadow-amber-100</code>),
                  subtle borders, breadcrumb chips. It sits under brand orange —
                  eyebrow labels and CTAs stay brand, not amber.
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Swatch name="amber-50" value="#fffbeb" note="Chip / tile bg" />
                  <Swatch name="amber-100" value="#fef3c7" note="Warm shadow tint" />
                  <Swatch name="amber-200" value="#fde68a" note="Subtle warm border" />
                  <Swatch name="amber-700" value="#b45309" note="Chip text" />
                </div>
              </div>

              <ScaleRow label="gray" scale={grayScale} aliasNote="custom neutral ramp" />
              <ScaleRow label="blue" scale={blueScale} aliasNote="custom" />
              <ScaleRow
                label="orange"
                scale={orangeScale}
                aliasNote="Tailwind scale — note: does NOT contain the brand #d85530"
              />

              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Semantic aliases
                </h3>
                <p className="max-w-2xl text-sm text-slate-600">
                  The Tailwind config remaps some names:{" "}
                  <code className="font-mono text-xs">teal</code> → cyan,{" "}
                  <code className="font-mono text-xs">green</code> → emerald,{" "}
                  <code className="font-mono text-xs">red</code> → rose. Reach for
                  these when you need status colours; they inherit Tailwind&apos;s
                  defaults for those palettes.
                </p>
              </div>
            </div>
          </SectionBlock>

          {/* TYPOGRAPHY */}
          <SectionBlock
            id="type"
            title="Typography"
            intro="Manrope is the one and only typeface. Headings are semibold/bold; body copy is regular."
          >
            <div className="space-y-10">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold text-slate-500">
                  font-sans / font-display
                </p>
                <p className="mt-1 text-4xl font-bold text-slate-900">
                  Manrope
                </p>
                <p className="mt-2 text-base text-slate-600">
                  The quick brown fox jumps over the lazy dog — 0123456789
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Weights loaded: 400, 500, 600, 700, 800
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Type scale
                </h3>
                <div className="space-y-3">
                  {typeScale.map(([name, size]) => (
                    <div
                      key={name}
                      className="flex items-baseline gap-4 border-b border-slate-100 pb-3"
                    >
                      <span className="w-16 shrink-0 font-mono text-xs text-slate-400">
                        {name}
                      </span>
                      <span className="w-20 shrink-0 font-mono text-xs text-slate-400">
                        {size}
                      </span>
                      <span
                        className="truncate font-semibold text-slate-900"
                        style={{ fontSize: size }}
                      >
                        Golden crumbed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* LAYOUT & SPACING */}
          <SectionBlock
            id="layout"
            title="Layout & spacing"
            intro="Containers are centred with responsive horizontal padding; cards use large radii and soft shadows."
          >
            <div className="space-y-10">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Breakpoints
                </h3>
                <div className="flex flex-wrap gap-3">
                  {breakpoints.map(([name, value]) => (
                    <div
                      key={name}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <p className="font-mono text-sm font-semibold text-slate-800">
                        {name}
                      </p>
                      <p className="font-mono text-xs text-slate-500">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Border radius
                </h3>
                <div className="flex flex-wrap gap-6">
                  {radii.map(([name, value]) => (
                    <div key={name} className="flex flex-col items-center gap-2">
                      <div
                        className="h-20 w-20 border-2 border-brand bg-brand-tint"
                        style={{ borderRadius: value }}
                      />
                      <p className="font-mono text-xs text-slate-500">{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Elevation
                </h3>
                <div className="flex flex-wrap gap-6">
                  {["shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"].map((s) => (
                    <div
                      key={s}
                      className={`flex h-20 w-32 items-center justify-center rounded-2xl bg-white ${s}`}
                    >
                      <p className="font-mono text-xs text-slate-500">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* BUTTONS */}
          <SectionBlock
            id="buttons"
            title="Buttons & links"
            intro="Pill-shaped, semibold, with a subtle lift on hover. Primary is solid brand; secondary is an outline."
          >
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-slate-200 bg-white p-8">
              <button className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-600">
                Primary button
              </button>
              <button className="rounded-full border-2 border-brand bg-white px-6 py-3 text-sm font-semibold text-brand shadow-sm shadow-brand/15 transition hover:-translate-y-0.5 hover:bg-brand-tint">
                Secondary / outline
              </button>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-brand">
                Inline text link →
              </span>
            </div>
          </SectionBlock>

          {/* COMPONENTS */}
          <SectionBlock
            id="components"
            title="Components"
            intro="The recurring building blocks, shown as they appear in the wild."
          >
            <div className="space-y-8">
              {/* Nav pills */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  Nav pills (on brand header)
                </p>
                <div className="flex flex-wrap gap-2 rounded-2xl bg-brand p-4">
                  <Pill active>Home</Pill>
                  <Pill>Reviews</Pill>
                  <Pill>Map</Pill>
                  <Pill>Blog</Pill>
                </div>
              </div>

              {/* Score badge */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  Score badge
                </p>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-brand-tint text-lg font-bold text-brand shadow-inner">
                  8.5
                </span>
              </div>

              {/* Review card */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  Review card
                </p>
                <article className="rounded-3xl border-2 border-brand-600 bg-brand px-8 py-9 text-white shadow-lg">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-brand-tint text-lg font-bold text-brand shadow-inner">
                      9
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold">The Local Tavern</h3>
                      <p className="mt-1 text-sm text-white/80">
                        Tasted by Brady
                      </p>
                    </div>
                  </div>
                </article>
              </div>

              {/* Feature card */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  Feature card
                </p>
                <div className="max-w-sm rounded-3xl border border-white/70 bg-white/80 px-8 py-10 shadow-lg shadow-amber-100/50 backdrop-blur">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Every parmi tells a story
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    From crispy crumbs to rich Napoli sauce.
                  </p>
                </div>
              </div>

              {/* Backdrop card utility */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  .backdrop-card utility
                </p>
                <div className="backdrop-card max-w-sm rounded-3xl px-8 py-10">
                  <p className="text-base text-slate-700">
                    Frosted glass card used for overlays.
                  </p>
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* CLEANUPS */}
          <SectionBlock
            id="inconsistencies"
            title="Recent cleanups"
            intro="Inconsistencies this design pass surfaced and resolved. Kept here as a record of the decisions."
          >
            <ul className="space-y-4">
              {[
                {
                  t: "Brand orange is now a token",
                  d: "#d85530 was hard-coded ~31×. It's now theme.colors.brand — use bg-brand / text-brand / border-brand. All site components migrated.",
                },
                {
                  t: "One button-hover shade",
                  d: "actions.tsx (#c84e2d) and Map.tsx (#c04a28) used two different hovers. Unified to brand-600.",
                },
                {
                  t: "Indigo review-card border removed",
                  d: "The stray #6b63ff border was replaced with border-brand-600, on-brand with the rest of the card.",
                },
                {
                  t: "Amber kept as a documented accent",
                  d: "Amber isn't a rogue palette — it's the warm secondary layer (shadows, chips, borders). The two amber eyebrow labels were moved to brand so only one accent competes for attention.",
                },
                {
                  t: "Unused fonts removed",
                  d: "Nunito and Lato were defined but never loaded. Removed from tailwind.config.js — Manrope is the only typeface.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-semibold text-slate-900">✓ {item.t}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.d}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">One watch-out</p>
              <p className="mt-1 text-sm text-amber-900/90">
                The map pin colour in <code className="font-mono text-xs">components/Map.tsx</code>{" "}
                is a raw <code className="font-mono text-xs">#d85530</code> — Leaflet/Google
                symbols take a colour string, not a class, so it can&apos;t use the token.
                Keep it in sync with <code className="font-mono text-xs">theme.colors.brand</code>.
              </p>
            </div>
          </SectionBlock>
        </main>

        <footer className="border-t border-slate-200 py-8 text-center">
          <p className="text-sm text-slate-500">
            Parmi Picks · internal design reference · not indexed
          </p>
        </footer>
      </div>
    </>
  );
}
