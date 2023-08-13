import { Container } from "../../components/util/container";
import { Section } from "../../components/util/section";
import { client } from "../../tina/__generated__/client";
import { Layout } from "../../components/layout";
import { Reviews } from "../../components/posts/reviews";
import { InferGetStaticPropsType } from "next";

export default function ReviewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const reviews = props.data.reviewConnection.edges;

  return (
    <Layout>
      <Section className="flex-1">
        <Container size="large" width="small">
          <Reviews data={reviews} />
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
