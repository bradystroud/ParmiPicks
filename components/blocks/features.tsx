import { Actions } from "../util/actions";
import { Section } from "../util/section";
import { Container } from "../util/container";

export const Feature = ({ data, tinaField }) => {
  return (
    <div
      data-tinafield={tinaField}
      className="flex min-h-[220px] flex-1 flex-col items-center gap-6 rounded-3xl border border-white/70 bg-white/80 px-8 py-10 text-center shadow-lg shadow-amber-100/50 backdrop-blur lg:items-start lg:text-left"
    >
      {data.title && (
        <h3
          data-tinafield={`${tinaField}.title`}
          className="text-2xl font-semibold text-slate-900"
        >
          {data.title}
        </h3>
      )}
      {data.text && (
        <p
          data-tinafield={`${tinaField}.text`}
          className="text-base leading-relaxed text-slate-600"
        >
          {data.text}
        </p>
      )}
      {data.actions && <Actions actions={data.actions} />}
    </div>
  );
};

export const Features = ({ data, parentField }) => {
  return (
    <Section>
      <Container size="large" className="max-w-6xl">
        <div className="mb-12 flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">
            Why locals love us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Every parmi tells a story
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            From crispy crumbs to rich Napoli sauce, our reviews dig into the details so you can plan your next pub visit with confidence.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items &&
            data.items.map(function (block, i) {
              return (
                <Feature
                  tinaField={`${parentField}.items.${i}`}
                  key={i}
                  data={block}
                />
              );
            })}
        </div>
      </Container>
    </Section>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature, if this wasn't just filler text.",
  icon: {
    color: "",
    style: "float",
    name: "",
  },
};

export const featureBlockSchema = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.title,
          };
        },
        defaultItem: {
          ...defaultFeature,
        },
      },
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Text",
          name: "text",
          ui: {
            component: "textarea",
          },
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
