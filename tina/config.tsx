/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import { contentBlockSchema } from "../components/blocks/content";
import { featureBlockSchema } from "../components/blocks/features";
import { heroBlockSchema } from "../components/blocks/hero";
import OpenAI from "openai";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [
      {
        label: "Reviews",
        name: "review",
        path: "content/reviews",
        format: "mdx",
        ui: {
          router: ({ document }) => {
            return `/reviews/${document._sys.filename}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "cannonicalUrl",
            label: "Cannonical URL",
            required: true,
          },
          {
            type: "image",
            name: "parmiImg",
            label: "Parmi Image",
          },
          {
            type: "number",
            name: "score",
            label: "Score",
          },
          {
            type: "reference",
            label: "Author",
            name: "author",
            collections: ["author"],
          },
          {
            type: "reference",
            label: "Restaurant",
            name: "restaurant",
            collections: ["restaurant"],
          },
          {
            type: "datetime",
            label: "Posted Date",
            name: "date",
            ui: {
              dateFormat: "MMMM DD YYYY",
              timeFormat: "hh:mm A",
            },
          },
          {
            type: "string",
            label: "Notes (hidden)",
            name: "notes",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            label: "TESTBody",
            name: "testbody",
            description: "Enter your notes and we'll generate a review 🤖",
            ui: {
              component: wrapFieldsWithMeta(({ input }) => {
                const [notes, setNotes] = useState("");
                const [review, setReview] = useState("no review yet");

                return (
                  <>
                    <div className="flex justify-between">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter your notes and we'll generate a review 🤖"
                      />
                      <button>
                        <FaStar
                          onClick={async () => {
                            console.log("generating content");

                            const openai = new OpenAI({
                              apiKey: OPENAI_API_KEY,
                              dangerouslyAllowBrowser: true,
                            });

                            const completion =
                              await openai.chat.completions.create({
                                model: "gpt-4o-mini",
                                messages: [
                                  {
                                    role: "system",
                                    content:
                                      "You are a content writer. You take notes from the user and turn them into a review (in Markdown, but no headings needed).",
                                  },
                                  {
                                    role: "user",
                                    content: "here are the notes: " + notes,
                                  },
                                ],
                              });

                            console.log(completion.choices[0].message);
                            setReview(completion.choices[0].message.content);
                          }}
                        />
                      </button>
                    </div>
                    <p className="w-48 m-3">{review}</p>
                  </>
                );
              }),
            },
          },
          {
            type: "rich-text",
            label: "Body",
            name: "_body",
            isBody: true,
          },
        ],
      },
      {
        label: "Global",
        name: "global",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
        },
        fields: [
          {
            type: "object",
            label: "Header",
            name: "header",
            fields: [
              {
                type: "string",
                label: "Name",
                name: "name",
              },
              {
                type: "object",
                label: "Nav Links",
                name: "nav",
                list: true,
                ui: {
                  itemProps: (item) => {
                    return { label: item?.label };
                  },
                  defaultItem: {
                    href: "home",
                    label: "Home",
                  },
                },
                fields: [
                  {
                    type: "string",
                    label: "Link",
                    name: "href",
                  },
                  {
                    type: "string",
                    label: "Label",
                    name: "label",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            label: "Footer",
            name: "footer",
            fields: [
              {
                type: "string",
                label: "Color",
                name: "color",
                options: [
                  { label: "Default", value: "default" },
                  { label: "Primary", value: "primary" },
                ],
              },
              {
                type: "object",
                label: "Social Links",
                name: "social",
                fields: [
                  {
                    type: "string",
                    label: "Twitter",
                    name: "twitter",
                  },
                  {
                    type: "string",
                    label: "Instagram",
                    name: "instagram",
                  },
                  {
                    type: "string",
                    label: "Github",
                    name: "github",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            label: "Theme",
            name: "theme",
            fields: [
              {
                type: "string",
                name: "font",
                label: "Font Family",
                options: [
                  {
                    label: "System Sans",
                    value: "sans",
                  },
                  {
                    label: "Nunito",
                    value: "nunito",
                  },
                  {
                    label: "Lato",
                    value: "lato",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Authors",
        name: "author",
        path: "content/authors",
        format: "md",
        fields: [
          {
            type: "string",
            label: "Name",
            name: "name",
            isTitle: true,
            required: true,
          },
          {
            type: "image",
            label: "Avatar",
            name: "avatar",
          },
        ],
      },
      {
        label: "Restaurants",
        name: "restaurant",
        path: "content/restaurant",
        format: "md",
        fields: [
          {
            type: "string",
            label: "Name",
            name: "name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Url",
            name: "url",
          },
        ],
      },
      {
        label: "Pages",
        name: "page",
        path: "content/pages",
        ui: {
          router: ({ document }) => {
            if (document._sys.filename === "home") {
              return `/`;
            }
            if (document._sys.filename === "about") {
              return `/about`;
            }
            return undefined;
          },
        },
        fields: [
          {
            type: "string",
            name: "cannonicalUrl",
            label: "Cannonical URL",
            required: true,
          },
          {
            type: "string",
            label: "Title",
            name: "title",
            description:
              "The title of the page. This is used to display the title in the CMS",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            list: true,
            name: "blocks",
            label: "Sections",
            ui: {
              visualSelector: true,
            },
            templates: [
              heroBlockSchema,
              // @ts-ignore
              featureBlockSchema,
              contentBlockSchema,
            ],
          },
        ],
      },
    ],
  },
});

export default config;
