/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  console.log(props.__filename);

  const date = new Date(data.review.date);
  let formattedDate = "";

  if (!isNaN(date.getTime())) {
    formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (data && data.review) {
    return (
      <Layout data={data.global as any}>
        <Head>
          <title>{data.review.restaurant.name} | ParmiPicks</title>
          <link
            rel="canonical"
            href={data.review.cannonicalUrl}
            key="canonical"
          />
          <meta
            property="og:title"
            content={`${data.review.restaurant.name} | Parmi Picks`}
          />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              itemReviewed: {
                "@type": "Thing",
                name: data.review.restaurant.name,
              },
              author: {
                "@type": "Person",
                name: data.review.author
                  ? data.review.author.name
                  : "Anonymous",
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: data.review.score,
                bestRating: "10",
              },
              datePublished: formattedDate,
              image: data.review.parmiImg,
              reviewBody: data.review._body.raw,
            })}
          </script>
        </Head>
        <Section className="flex-1">
          <Container width="small" className={`flex-1 pb-2`} size="large">
            <h1
              className={`w-full relative mb-8 text-6xl tracking-normal text-center title-font`}
            >
              <span className="font-extrabold">{data.review.score}</span> -{" "}
              {data.review.restaurant.name}
            </h1>
            <div className="relative w-300 h-400 m-auto">
              {data?.review?.parmiImg ? (
                <Image
                  src={data.review?.parmiImg}
                  alt={`Chicken parmi from ${data.review.restaurant.name}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                />
              ) : (
                "No image 🫢"
              )}
            </div>
            <div
              data-tinafield="author"
              className="flex items-center justify-center my-8"
            >
              {data.review.author && (
                <>
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      className="h-14 w-14 object-cover rounded-full shadow-sm"
                      src={data.review.author.avatar}
                      alt={data.review.author.name}
                      height={56}
                      width={56}
                    />
                  </div>
                  <p className="text-base font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-white">
                    {data.review.author.name}
                  </p>
                  <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">
                    —
                  </span>
                </>
              )}
              <p
                data-tinafield="date"
                className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150"
              >
                {formattedDate}
              </p>
            </div>
          </Container>
          <Container className={`flex-1 pt-4`} width="small" size="large">
            <div className="prose dark:prose-dark w-full max-w-none">
              <TinaMarkdown content={data.review._body} />
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  return (
    <Layout>
      <div>No data</div>;
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.reviewQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
      __filename,
    },
  };
};

export const getStaticPaths = async () => {
  const reviewsListData = await client.queries.reviewConnection();
  console.log(
    reviewsListData.data.reviewConnection.edges[0].node._sys.filename
  );
  return {
    paths: reviewsListData.data.reviewConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
};
