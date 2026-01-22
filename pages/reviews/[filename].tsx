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
import MapEmbed from "../../components/blocks/map";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  if (!data || !data.review) {
    return (
      <Layout>
        <div>No data</div>
      </Layout>
    );
  }

  const date = new Date(data.review.date);
  const formattedDate = !isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  const restaurant = data.review.restaurant;
  const title = `${restaurant.name} | Parmi Picks`;

  return (
    <Layout data={data.global as any}>
      <Head>
        <title>{title}</title>
        <link
          rel="canonical"
          href={data.review.canonicalUrl}
          key="canonical"
        />
        <meta property="og:title" content={title} />
        <meta property="description" content={data.review._body.raw} />
        <meta property="og:description" content={data.review._body.raw} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "Thing",
              name: restaurant.name,
            },
            author: {
              "@type": "Person",
              name: data.review.author?.name ?? "Anonymous",
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
            {restaurant.name}
          </h1>
          <div className="relative mx-auto mb-10 aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-3xl border border-amber-200/60 bg-white/80 shadow-xl shadow-amber-100/50">
            {data.review.parmiImg ? (
              <Image
                src={data.review.parmiImg}
                alt={`Chicken parmi from ${restaurant.name}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover"
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
          <div className="mt-12 rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 p-8 shadow-lg shadow-amber-100/40">
            <h3 className="text-2xl font-semibold text-slate-900">
              Plan your visit
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Find {restaurant.name} on the map and plan your next parmi pilgrimage.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/80 bg-white/70 shadow-inner">
              <div className="relative h-[320px] w-full">
                <MapEmbed
                  location={restaurant.location || restaurant.name}
                  className="h-full w-full"
                  title={`Map showing ${restaurant.name}`}
                />
              </div>
            </div>
          </div>
          {/* <Giscus
            key={title}
            repo="bradystroud/parmipicks"
            category="Comments"
            categoryId="DIC_kwDOJVwLxc4CfgKc"
            repoId="R_kgDOJVwLxQ"
            mapping="title"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
            loading="lazy"
            term="Welcome to Parmi Picks! Leave a comment or ask a question."
          /> */}
        </Container>
      </Section>
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
    },
  };
};

export const getStaticPaths = async () => {
  const reviewsListData = await client.queries.reviewConnection();
  return {
    paths: reviewsListData.data.reviewConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
};
