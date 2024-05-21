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
        <Container size="large" width="small">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl title-font mb-4">Parmi Reviews</h1>
            <select
              className="max-h-10 text-md"
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
