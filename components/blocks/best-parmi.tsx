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
      <Container size="large" className="max-w-5xl" data-tinafield={parentField}>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#d85530] text-white shadow-xl">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-6">
              <div className="text-center lg:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                  House Favourite
                </p>
                <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                  {heading}
                </h2>
              </div>

              <div className="flex flex-col gap-4 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl text-[#d85530]">
                    ★
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {formattedScore}/10
                    </p>
                    {topParmi && formattedDate && (
                      <p className="text-xs text-white/70">
                        Crowned on {formattedDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-relaxed text-white/85">
                {description}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={reviewHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#d85530] shadow-sm transition hover:bg-[#fff3ee] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  {...externalLinkProps}
                >
                  {ctaLabel}
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>
                <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {updatedCopy}
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/10 p-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
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
                      className="absolute inset-0 bg-white/80"
                      aria-hidden="true"
                    />
                  )}
                </div>
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
