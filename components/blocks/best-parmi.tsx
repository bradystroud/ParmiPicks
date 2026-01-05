import * as React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { Template } from "tinacms";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface TopParmiSource {
  score?: number | string | null;
  name?: string | null;
  date?: string | null;
  parmiImg?: string | null;
  canonicalUrl?: string | null;
  restaurant?: {
    name?: string | null;
  } | null;
  node?: TopParmiSource | null;
}

interface BestParmiProps {
  data?: {
    isDataDriven?: boolean | null;
  } | null;
  parentField?: string;
  topParmi?: TopParmiSource | null;
}

interface TopParmi {
  score: number | null;
  name: string;
  date?: string | null;
  imageUrl?: string | null;
  reviewUrl?: string | null;
}

const normalizeTopParmi = (
  source?: TopParmiSource | null
): TopParmi | null => {
  if (!source || typeof source !== "object") {
    return null;
  }

  if ("node" in source && source.node) {
    return normalizeTopParmi(source.node);
  }

  const rawScore = source.score;
  const score = (() => {
    if (typeof rawScore === "number" && Number.isFinite(rawScore)) {
      return rawScore;
    }
    if (typeof rawScore === "string") {
      const parsed = parseFloat(rawScore);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  })();

  const restaurantName =
    typeof source.restaurant?.name === "string"
      ? source.restaurant.name
      : undefined;
  const fallbackName = typeof source.name === "string" ? source.name : undefined;
  const name = restaurantName ?? fallbackName ?? null;
  const date = typeof source.date === "string" ? source.date : null;
  const imageUrl =
    typeof source.parmiImg === "string" ? source.parmiImg : null;
  const reviewUrl =
    typeof source.canonicalUrl === "string" ? source.canonicalUrl : null;

  if (!name && score === null && !imageUrl && !reviewUrl && !date) {
    return null;
  }

  return {
    score,
    name: name ?? "Best Parmi",
    date,
    imageUrl,
    reviewUrl,
  };
};

export const BestParmi = ({
  data,
  parentField,
  topParmi: topParmiProp,
}: BestParmiProps) => {
  const isDataDriven = data?.isDataDriven ?? true;
  const topParmi = useMemo(() => normalizeTopParmi(topParmiProp), [topParmiProp]);

  const reviewHref = useMemo(() => {
    const rawReviewUrl = topParmi?.reviewUrl;

    if (!rawReviewUrl) {
      return "/reviews";
    }

    if (rawReviewUrl.startsWith("http")) {
      return rawReviewUrl;
    }

    return `/reviews/${rawReviewUrl.replace(/^\/+/, "")}`;
  }, [topParmi?.reviewUrl]);

  const isExternalReview = useMemo(() => {
    const rawReviewUrl = topParmi?.reviewUrl;
    return Boolean(rawReviewUrl && rawReviewUrl.startsWith("http"));
  }, [topParmi?.reviewUrl]);

  const formattedDate = useMemo(() => {
    const rawDate = topParmi?.date;

    if (!rawDate) {
      return null;
    }

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [topParmi?.date]);

  const formattedScore = useMemo(() => {
    if (!topParmi || topParmi.score == null) {
      return "–";
    }

    const formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: topParmi.score % 1 === 0 ? 0 : 1,
    });

    return formatter.format(topParmi.score);
  }, [topParmi]);

  const badgeLabel = topParmi ? "Top Rated" : "In Review";

  const heading = topParmi?.name ?? "No parmi crowned yet";

  const description = topParmi
    ? "This parmi earned the highest score in our reviews and is the one we keep recommending to friends. Expect golden crumbed chicken, lashings of sauce, and a plate worth travelling for."
    : "We haven't crowned a best parmi just yet. Explore the full list while we keep tasting and updating our leaderboard.";

  const ctaLabel = topParmi ? "Read the full review" : "Browse all reviews";

  const updatedCopy = topParmi
    ? `Updated ${formattedDate ?? "recently"}`
    : isDataDriven
    ? "No winner yet — stay tuned!"
    : "Editor curated — update this block anytime.";

  const externalLinkProps: { target?: string; rel?: string } = isExternalReview
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Section>
      <Container size="large" className="gap-8" data-tinafield={parentField}>
        <div className="flex flex-col gap-6 text-center md:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
            House Favourite
          </p>
          <h2 className="text-4xl font-semibold text-slate-900 md:text-5xl">
            Best Parmi
          </h2>
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-900 shadow-2xl ring-1 ring-amber-200/60">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="relative flex flex-col gap-6 p-8 sm:p-12">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex items-center gap-3 self-start rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                  {badgeLabel}
                </div>

                <h3 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  {heading}
                </h3>

                <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6">
                  <div className="inline-flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-amber-300">
                      ★
                    </span>
                    <span className="text-base font-semibold text-slate-900 sm:text-lg">
                      {formattedScore}/10
                    </span>
                  </div>

                  {topParmi && formattedDate && (
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      Crowned on {formattedDate}
                    </span>
                  )}
                </div>
              </div>

              <p className="max-w-xl text-base text-slate-600">{description}</p>

              <div className="mt-auto flex flex-col items-start gap-4 sm:flex-row">
                <Link
                  href={reviewHref}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                  {...externalLinkProps}
                >
                  {ctaLabel}
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>

                <span className="text-sm text-slate-500">{updatedCopy}</span>
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden lg:min-h-[380px]">
              {topParmi?.imageUrl ? (
                <Image
                  src={topParmi.imageUrl}
                  alt={topParmi?.name ? `${topParmi.name} parmi` : "Parmi"}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-white"
                  aria-hidden="true"
                />
              )}

              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-slate-900/0 to-white/20 lg:bg-gradient-to-l"
                aria-hidden="true"
              />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                <span>Chef&apos;s pick</span>
                <span>Parmi Picks</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export const bestParmiBlockSchema: Template = {
  name: "bestParmi",
  label: "Best Parmi",
  ui: {
    previewSrc: "/blocks/content.png",
  },
  fields: [
    {
      type: "boolean",
      label: "Data Driven?",
      name: "isDataDriven",
    },
  ],
};
