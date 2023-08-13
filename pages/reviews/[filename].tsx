import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import Image from "next/image";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import format from "date-fns/format";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

// Use the props returned by get static props
export default function ReviewPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const date = new Date(data.review.date);
  let formattedDate = "";
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, "MMM dd, yyyy");
  }

  if (data && data.review) {
    return (
      <Layout rawData={data} data={data.global as any}>
        <Section className="flex-1">
          <Container width="small" className={`flex-1 pb-2`} size="large">
            <h1
              className={`w-full relative	mb-8 text-6xl tracking-normal text-center title-font`}
            >
              <span className="font-extrabold">{data.review.score}</span> -{" "}
              {data.review.restaurant.name}
            </h1>
            <div className="relative w-300 h-400 m-auto">
              {data?.review?.parmiImg ? (
                <img src={data.review?.parmiImg} />
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
                    <img
                      className="h-14 w-14 object-cover rounded-full shadow-sm"
                      src={data.review.author.avatar}
                      alt={data.review.author.name}
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

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
