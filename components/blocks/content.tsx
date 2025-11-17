import React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";

export const Content = ({ data, parentField = "" }) => {
  return (
    <Section>
      <Container size="large" width="medium" className="max-w-3xl">
        <div
          className={`prose prose-lg mx-auto rounded-3xl border border-white/60 bg-white/80 px-8 py-10 shadow-lg shadow-amber-100/40 backdrop-blur ${
            data.color === "primary" ? `prose-primary` : ``
          }`}
          data-tinafield={`${parentField}.body`}
        >
          <TinaMarkdown content={data.body} />
        </div>
      </Container>
    </Section>
  );
};

export const contentBlockSchema: Template = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
