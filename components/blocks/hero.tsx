import * as React from "react";
import { Actions } from "../util/actions";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";

export const Hero = ({ data, parentField }) => {
  return (
    <Section className="pt-28">
      <Container
        size="large"
        className="grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.15fr,0.85fr]"
      >
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          {data.tagline && (
            <p
              data-tinafield={`${parentField}.tagline`}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600"
            >
              {data.tagline}
            </p>
          )}
          {data.headline && (
            <h1
              data-tinafield={`${parentField}.headline`}
              className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              {data.headline}
            </h1>
          )}
          {data.text && (
            <div
              data-tinafield={`${parentField}.text`}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
            >
              <TinaMarkdown content={data.text} />
            </div>
          )}
          {data.actions && (
            <Actions
              parentField={`${parentField}.actions`}
              className="mt-8 justify-center gap-4 lg:justify-start"
              actions={data.actions}
            />
          )}
        </div>
        {data.image && (
          <div
            data-tinafield={`${parentField}.image`}
            className="order-1 relative flex justify-center lg:order-2"
          >
            <div
              className="backdrop-card absolute inset-0 -z-10 rounded-[3rem] bg-white/60 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-2xl shadow-amber-100/60">
              <div
                className="pointer-events-none absolute -top-10 right-4 h-28 w-28 rounded-full bg-orange-300/30 blur-2xl"
                aria-hidden="true"
              />
              <img
                className="relative z-10 h-full w-full max-w-sm object-cover"
                alt={data.image.alt}
                src={data.image.src}
              />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

export const heroBlockSchema: Template = {
  name: "hero",
  label: "Hero",
  ui: {
    previewSrc: "/blocks/hero.png",
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: "This Big Text is Totally Awesome",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
    },
  },
  fields: [
    {
      type: "string",
      label: "Tagline",
      name: "tagline",
    },
    {
      type: "string",
      label: "Headline",
      name: "headline",
    },
    {
      label: "Text",
      name: "text",
      type: "rich-text",
    },
    {
      label: "Actions",
      name: "actions",
      type: "object",
      list: true,
      ui: {
        defaultItem: {
          label: "Action Label",
          type: "button",
          icon: true,
          link: "/",
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: "Label",
          name: "label",
          type: "string",
        },
        {
          label: "Type",
          name: "type",
          type: "string",
          options: [
            { label: "Button", value: "button" },
            { label: "Link", value: "link" },
          ],
        },
        {
          label: "Icon",
          name: "icon",
          type: "boolean",
        },
        {
          label: "Link",
          name: "link",
          type: "string",
        },
      ],
    },
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
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
