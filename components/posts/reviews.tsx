import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { SortType } from "../types";

export const Reviews = ({
  data,
  sortOption,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  sortOption: SortType;
}) => {
  // The highest-scoring parmi wears the crown (matches the House Favourite on
  // the home page). Tie-break on the more recent review so exactly one wins.
  const crownedFilename = React.useMemo(() => {
    const scored = data
      .map((d) => d.node)
      .filter((n) => n && !Number.isNaN(Number(n.score)));
    if (!scored.length) return null;
    const top = [...scored].sort((a, b) => {
      const byScore = Number(b.score) - Number(a.score);
      if (byScore !== 0) return byScore;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })[0];
    return top?._sys?.filename ?? null;
  }, [data]);

  const reviewList = [...data].sort((a, b) => {
    if (sortOption === "Top") {
      return b.node.score - a.node.score;
    } else if (sortOption === "Low") {
      return a.node.score - b.node.score;
    } else if (sortOption === "Recent") {
      return new Date(b.node.date).getTime() - new Date(a.node.date).getTime();
    } else {
      return 0;
    }
  });

  return (
    <>
      {reviewList.map((reviewData) => {
        const post = reviewData.node;
        const isCrowned = post._sys.filename === crownedFilename;
        return (
          <Link
            key={post._sys.filename}
            href={`/reviews/` + post._sys.filename}
            className="group block"
          >
            <article className="mb-8 rounded-3xl border-2 border-brand-600 bg-brand px-8 py-9 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-brand-tint text-lg font-bold text-brand shadow-inner" aria-label={`Score: ${post.score} out of 10${isCrowned ? " (top rated)" : ""}`} role="img">
                    {isCrowned && (
                      <FaCrown
                        className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 -rotate-[18deg] text-amber-300 drop-shadow-md"
                        aria-hidden="true"
                      />
                    )}
                    {post.score}
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold sm:text-3xl">
                      {post.restaurant?.name ?? "This venue"}
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Tasted by {post?.author?.name}
                    </p>
                  </div>
                </div>
                <span className="hidden items-center gap-2 text-sm font-medium text-white/70 sm:inline-flex">
                  Read review
                  <BsArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </>
  );
};
