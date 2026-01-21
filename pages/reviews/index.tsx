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
        <Container size="large" width="small" className="max-w-5xl">
          <div className="mb-14 text-center">
            <h1 className="text-3xl font-semibold text-[#d85530] sm:text-4xl">
              Parmi Reviews
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#d85530]/80">
              Browse every chicken parmigiana we&apos;ve tasted — complete with scores,
              tasting notes, and the pubs that serve them best.
            </p>
            <div className="mt-8 flex justify-center">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <div className="relative">
                <select
                  className="appearance-none rounded-full bg-[#d85530] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#d85530]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d85530]/50"
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
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/80"
                >
                  ▼
                </span>
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
