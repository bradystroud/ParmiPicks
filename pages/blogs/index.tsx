import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function BlogsPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout data={data.global as any}>
      <Head>
        <title>Blog Posts | Parmi Picks</title>
        <meta
          name="description"
          content="Read our latest blog posts about chicken parmis and more"
        />
      </Head>
      <Section className="flex-1">
        <Container width="large" className={`flex-1 pb-8`} size="large">
          <h1 className="text-4xl font-bold text-center mb-12">Blog Posts</h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.blogConnection.edges
              .sort(
                (a, b) =>
                  new Date(b.node.date).getTime() -
                  new Date(a.node.date).getTime()
              )
              .map((post) => {
                const date = new Date(post.node.date);
                const formattedDate = !isNaN(date.getTime())
                  ? date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "";

                return (
                  <Link
                    key={post.node._sys.filename}
                    href={`/blogs/${post.node._sys.filename}`}
                    className="group"
                  >
                    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                      {post.node.heroImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={post.node.heroImage}
                            alt={post.node.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                          {post.node.title}
                        </h2>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          {post.node.author && (
                            <div className="flex items-center mr-4">
                              <Image
                                src={post.node.author.avatar}
                                alt={post.node.author.name}
                                width={24}
                                height={24}
                                className="rounded-full mr-2"
                              />
                              <span>{post.node.author.name}</span>
                            </div>
                          )}
                          <time>{formattedDate}</time>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const tinaProps = await client.queries.blogListQuery();
  return {
    props: {
      ...tinaProps,
    },
  };
};
