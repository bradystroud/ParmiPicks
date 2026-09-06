import { client } from "../../tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";
import { Section } from "../../components/util/section";
import { Container } from "../../components/util/container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Giscus from "@giscus/react";
import {
  avatarSrc,
  localMedia,
  localMediaAbsolute,
} from "../../components/util/media";
import { excerptFromRichText } from "../../components/util/excerpt";
import {
  canonicalUrl,
  slugFromRelativePath,
} from "../../components/util/canonical";

export default function BlogPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  if (!data || !data.blog) {
    return (
      <Layout>
        <div>No data</div>
      </Layout>
    );
  }

  const date = new Date(data.blog.date);
  const isValidDate = !isNaN(date.getTime());
  const formattedDate = isValidDate
    ? date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  // schema.org requires ISO 8601 here, not the human-readable date.
  const isoDate = isValidDate ? date.toISOString() : undefined;

  const title = `${data.blog.title} | Parmi Picks`;

  const excerpt = excerptFromRichText(
    data.blog._body,
    `${data.blog.title} — from the Parmi Picks blog.`
  );

  const ogImage = localMediaAbsolute(data.blog.heroImage);
  const canonical = canonicalUrl(
    `/blogs/${slugFromRelativePath(props.variables.relativePath)}`
  );

  return (
    <Layout data={data.global}>
      <Head>
        <title>{title}</title>
        <link
          rel="canonical"
          href={canonical}
          key="canonical"
        />
        <meta property="og:title" content={title} key="og:title" />
        <meta name="description" content={excerpt} key="desc" />
        <meta property="og:description" content={excerpt} key="og:description" />
        {ogImage && (
          <meta property="og:image" content={ogImage} key="og:image" />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: data.blog.title,
            author: {
              "@type": "Person",
              name: data.blog.author?.name ?? "Anonymous",
            },
            datePublished: isoDate,
            image: ogImage || undefined,
            description: excerpt,
          })}
        </script>
      </Head>
      <Section className="flex-1">
        <Container width="small" className={`flex-1 pb-2`} size="large">
          <h1
            className={`w-full relative mb-8 text-6xl tracking-normal text-center title-font font-extrabold`}
          >
            {data.blog.title}
          </h1>
          {data.blog.heroImage && (
            <div className="relative w-full h-[400px] mb-8">
              <Image
                src={localMedia(data.blog.heroImage)}
                alt={data.blog.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div
            data-tinafield="author"
            className="flex items-center justify-center mb-8"
          >
            {data.blog.author && (
              <>
                <div className="flex-shrink-0 mr-4">
                  <Image
                    className="h-14 w-14 object-cover rounded-full shadow-sm"
                    src={avatarSrc(data.blog.author.avatar)}
                    alt={`Avatar of ${data.blog.author.name}`}
                    height={56}
                    width={56}
                  />
                </div>
                <p className="text-base font-medium text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-white">
                  {data.blog.author.name}
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
            <TinaMarkdown content={data.blog._body} />
          </div>
          <br />
          <Giscus
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
          />
        </Container>
      </Section>
    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.blogQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

export const getStaticPaths = async () => {
  const blogsListData = await client.queries.blogConnection();
  return {
    paths: blogsListData.data.blogConnection.edges.map((post) => ({
      params: { filename: post.node._sys.filename },
    })),
    fallback: "blocking",
  };
}; 