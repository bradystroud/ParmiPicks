import * as React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { Template } from "tinacms";

export const BestParmi = ({ data, parentField }) => {
  return (
    <Section>
      <Container
        size="large"
        className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center justify-center"
      >
        <h2 className="text-3xl font-semibold">Best Parmi</h2>
        <p>
          {data?.restaurant?.name} - {data.score}
        </p>
      </Container>
    </Section>
  );
};

export const bestParmiBlockSchema: Template = {
  name: "bestParmi",
  label: "Best Parmi",
  ui: {
    previewSrc: "/blocks/content.png",
  },
  fields: [
    {
      type: "boolean",
      label: "Data Driven?",
      name: "isDataDriven",
    },
    {
      type: "reference",
      label: "Restaurant",
      name: "restaurant",
      collections: ["restaurant"],
    },
    {
      type: "number",
      label: "Score",
      name: "score",
    },
  ],
};
