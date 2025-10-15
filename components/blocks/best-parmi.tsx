import * as React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { Template } from "tinacms";
import { useEffect, useMemo, useState } from "react";
import { client } from "../../tina/__generated__/client";
import Image from "next/image";
import Link from "next/link";

export const BestParmi = ({ data, parentField }) => {
  const [topParmi, setTopParmi] = useState<TopParmi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const shouldFetch = data?.isDataDriven ?? true;

  useEffect(() => {
    let isMounted = true;

    if (!shouldFetch) {
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchData = async () => {
      try {
        const result = await client.queries.topReviewQuery();
        const node = result?.data?.reviewConnection?.edges?.[0]?.node;

        if (!node) {
          return;
        }

        const scoreValue =
          typeof node.score === "number"
            ? node.score
            : parseFloat(node.score ?? "0");

        if (isMounted) {
          setTopParmi({
            score: Number.isFinite(scoreValue) ? scoreValue : 0,
            name: node?.restaurant?.name ?? "Best Parmi",
            date: node.date,
            imageUrl: node.parmiImg,
            reviewUrl: node.canonicalUrl,
          });
        }
      } catch (error) {
        console.error("Failed to fetch top parmi", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [shouldFetch]);

  const reviewHref = useMemo(() => {
    if (!topParmi?.reviewUrl) {
      return "/reviews";
    }

    if (topParmi.reviewUrl.startsWith("http")) {
      return topParmi.reviewUrl;
    }

    return `/reviews/${topParmi.reviewUrl.replace(/^\/+/, "")}`;
  }, [topParmi?.reviewUrl]);

  const formattedDate = useMemo(() => {
    if (!topParmi?.date) {
      return null;
    }

    const date = new Date(topParmi.date);

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
    if (!topParmi) {
      return "-";
    }

    const formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: topParmi.score % 1 === 0 ? 0 : 1,
    });

    return formatter.format(topParmi.score);
  }, [topParmi]);

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
                  Top Rated
                </div>

                <h3 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  {isLoading ? "Finding your parmi..." : topParmi?.name ?? "Best Parmi"}
                </h3>

                <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6">
                  <div className="inline-flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-lg font-semibold text-white">
                      ★
                    </span>
                    <span className="text-base font-semibold text-slate-900 sm:text-lg">
                      {formattedScore}/10
                    </span>
                  </div>

                  {formattedDate && (
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      Crowned on {formattedDate}
                    </span>
                  )}
                </div>
              </div>

              <p className="max-w-xl text-base text-slate-600">
                This parmi earned the highest score in our reviews and is the one we
                keep recommending to friends. Expect golden crumbed chicken, lashings
                of sauce, and a plate worth travelling for.
              </p>

              <div className="mt-auto flex flex-col items-start gap-4 sm:flex-row">
                <Link
                  href={reviewHref}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
                >
                  Read the full review
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>

                <span className="text-sm text-slate-500">
                  Updated {formattedDate ?? "recently"}
                </span>
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-white" aria-hidden="true" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-slate-900/0 to-white/40 lg:bg-gradient-to-l" aria-hidden="true" />

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

interface TopParmi {
  score: number;
  name: string;
  date: string;
  imageUrl?: string | null;
  reviewUrl?: string | null;
}
