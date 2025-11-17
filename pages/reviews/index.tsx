import { Container } from "../../components/util/container";
import { Section } from "../../components/util/section";
import { client } from "../../tina/__generated__/client";
import { Layout } from "../../components/layout";
import { Reviews } from "../../components/posts/reviews";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useState } from "react";
import { SortType, sortOptions } from "../../components/types";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const reviews = props.data.reviewConnection.edges;
  const pageTitle = "ParmiPicks | Reviews";

  const [selectedSort, setSelectedSort] = useState<SortType | "Recent">("Recent");

  const handleChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const sortOptionsArray: SortType[] = Object.keys(sortOptions) as SortType[];

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <link
          rel="canonical"
          href="https://parmipicks.com/reviews"
          key="canonical"
        />
      </Head>
      <Section className="flex-1">
        <Container size="large" width="small" className="max-w-6xl">
          <div className="mb-12 rounded-3xl border border-white/70 bg-white/80 px-8 py-10 shadow-lg shadow-amber-100/40 backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">
                  Real pub experiences
                </p>
                <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                  Parmi reviews
                </h1>
                <p className="mt-4 max-w-2xl text-base text-slate-600">
                  Browse every chicken parmigiana we&apos;ve tasted — complete with scores, tasting notes, and the pubs that serve them best.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm font-semibold text-slate-500">
                  Sort by
                </label>
                <select
                  className="w-full max-w-[10rem] rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                  name="sort"
                  id="sort"
                  onChange={handleChange}
                  value={selectedSort}
                >
                  {sortOptionsArray.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Reviews data={reviews.sort()} sortOption={selectedSort} />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const tinaProps = await client.queries.reviewPageQuery();
  return {
    props: {
      ...tinaProps,
    },
  };
};
