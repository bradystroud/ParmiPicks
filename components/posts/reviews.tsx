import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { SortType } from "../types";
import Image from "next/image";

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
        const date = new Date(post.date);
        let formattedDate = "";

        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        return (
          <Link
            key={post._sys.filename}
            href={`/reviews/` + post._sys.filename}
            className="group block"
          >
            <article className="mb-8 rounded-3xl border border-white/70 bg-white/80 px-8 py-10 shadow-lg shadow-amber-100/40 transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-semibold text-slate-900 transition group-hover:text-amber-600">
                  <span className="mr-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white shadow-inner">
                    {post.score}
                  </span>
                  {post.restaurant.name}
                </h2>
                <span className="hidden items-center gap-2 text-sm font-medium text-slate-400 sm:inline-flex">
                  Read review
                  <BsArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-amber-200/60 bg-white/70 shadow-sm">
                    <Image
                      className="h-full w-full object-cover"
                      src={post?.author?.avatar}
                      alt={post?.author?.name}
                      height={48}
                      width={48}
                    />
                  </div>
                  <p className="text-base font-semibold text-slate-700 group-hover:text-slate-900">
                    {post?.author?.name}
                  </p>
                </div>
                {formattedDate !== "" && (
                  <div className="inline-flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-500">
                    <span className="h-1 w-1 rounded-full bg-amber-400" aria-hidden="true" />
                    {formattedDate}
                  </div>
                )}
              </div>
            </article>
          </Link>
        );
      })}
    </>
  );
};
