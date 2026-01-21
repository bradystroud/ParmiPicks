import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { SortType } from "../types";

export const Reviews = ({
  data,
  sortOption,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  sortOption: SortType;
}) => {
  const reviewList = data.sort((a, b) => {
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
        return (
          <Link
            key={post._sys.filename}
            href={`/reviews/` + post._sys.filename}
            className="group block"
          >
            <article className="mb-8 rounded-3xl border-2 border-[#6b63ff] bg-[#d85530] px-8 py-9 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#fff3ee] text-lg font-bold text-[#d85530] shadow-inner">
                    {post.score}
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold sm:text-3xl">
                      {post.restaurant.name}
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Tasted by {post?.author?.name}
                    </p>
                  </div>
                </div>
                <span className="hidden items-center gap-2 text-sm font-medium text-white/70 sm:inline-flex">
                  Read review
                  <BsArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </>
  );
};
