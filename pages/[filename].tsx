import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { client } from "../tina/__generated__/client";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Layout data={data.global as any}>
      <Head>
        <link rel="canonical" href={data.page.canonicalUrl} key="canonical" />
        <meta property="og:title" content="Parmi Picks" />
        <title>ParmiPicks</title>
      </Head>
      <Blocks {...data.page} topParmi={props.topParmi ?? null} />
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `${params.filename}.md`,
  });

  const moreProps = await client.queries.topReviewQuery();

  const topParmiNode =
    moreProps?.data?.reviewConnection?.edges?.[0]?.node ?? null;

  return {
    props: {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
      topParmi: topParmiNode,
    },
  };
};

export const getStaticPaths = async () => {
  const pagesListData = await client.queries.pageConnection();
  return {
    paths: pagesListData.data.pageConnection.edges.map((page) => ({
      params: { filename: page.node._sys.filename },
    })),
    fallback: false,
  };
};
