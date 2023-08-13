import { Container } from "../../components/util/container";
import { Section } from "../../components/util/section";
import { client } from "../../tina/__generated__/client";
import { Layout } from "../../components/layout";
import { Reviews } from "../../components/posts/reviews";

export default function ReviewPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
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

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
