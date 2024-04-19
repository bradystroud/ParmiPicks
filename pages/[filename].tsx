import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { client } from "../tina/__generated__/client";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import Head from "next/head";

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const bestParmi = props.topParmi.node;
  const bestParmiReview = bestParmi.id.split(".")[0];
  // remove content from the url✅✅
  const bestParmiReviewUrl = bestParmiReview.replace("content", "");
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Layout data={data.global as any}>
      <Head>
        <link rel="canonical" href={data.page.cannonicalUrl} key="canonical" />
        <meta property="og:title" content="Parmi Picks" />
        <title>ParmiPicks</title>
      </Head>
      <Blocks {...data.page} />
      <section className="m-auto">
        <Link href={bestParmiReviewUrl} className="hidden sm:block">
          <div className="badge">
            <svg width="300" height="50" className="best">
              {" "}
              <path
                id="curve"
                d="M100,25 A140,85 0 0 1 290,120"
                fill="transparent"
              />
              <text fill="white" style={{ fontSize: "20px" }}>
                <textPath href="#curve">BEST PARMI</textPath>
              </text>
            </svg>
            <div className="flex flex-col items-center pt-4">
              <div className="score">{bestParmi.score}</div>
              <div className="text-xl">{bestParmi.restaurant.name}</div>
            </div>
          </div>
        </Link>
      </section>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `${params.filename}.md`,
  });

  const moreProps = await client.queries.topReviewQuery();

  return {
    props: {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
      topParmi: moreProps.data.reviewConnection.edges[0],
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
