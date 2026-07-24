import * as React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { localMedia } from "../util/media";
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
  parentField,
  topParmi: topParmiProp,
}: BestParmiProps) => {
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

    return date.toLocaleDateString("en-AU", {
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

  const heading = topParmi?.name ?? "No parmi crowned yet";

  const description = topParmi
    ? "This parmi earned the highest score in our reviews and is the one we keep recommending to friends. Expect golden crumbed chicken, lashings of sauce, and a plate worth travelling for."
    : "We haven't crowned a best parmi just yet. Explore the full list while we keep tasting and updating our leaderboard.";

  const ctaLabel = topParmi ? "Read the full review" : "Browse all reviews";

  const externalLinkProps: { target?: string; rel?: string } = isExternalReview
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Section className="pt-0 -mt-20 sm:-mt-24">
      <Container size="large" className="max-w-5xl" data-tinafield={parentField}>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-200/60 bg-amber-50/60 shadow-lg shadow-amber-100/40">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-6">
              <div className="text-center lg:text-left">
                <p className="text-base font-bold text-slate-700">
                  House Favourite
                </p>
                <h2 className="mt-2 text-4xl font-bold text-slate-800 sm:text-5xl">
                  {heading}
                </h2>
              </div>

              <div className="flex items-center justify-center gap-4 lg:justify-start">
                <span
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 640 512"
                    fill="currentColor"
                    className="h-7 w-7"
                  >
                    <path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 101.5 0 128s21.5 48 48 48c.9 0 1.8-.2 2.7-.3L96 400h448l45.3-224.3c.9.1 1.8.3 2.7.3 26.5 0 48-21.5 48-48s-21.5-48-48-48z" />
                  </svg>
                </span>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {formattedScore}/10
                  </p>
                  {topParmi && formattedDate && (
                    <p className="text-sm leading-tight text-slate-500">
                      Crowned on
                      <br />
                      {formattedDate}
                    </p>
                  )}
                </div>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                {description}
              </p>

              <div className="mt-2 flex justify-center lg:justify-start">
                <Link
                  href={reviewHref}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  {...externalLinkProps}
                >
                  {ctaLabel}
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-md">
                {topParmi?.imageUrl ? (
                  <Image
                    src={localMedia(topParmi.imageUrl)}
                    alt={topParmi?.name ? `${topParmi.name} parmi` : "Parmi"}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-amber-50"
                    aria-hidden="true"
                  />
                )}
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
