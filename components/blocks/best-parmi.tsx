import * as React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { Template } from "tinacms";
import { useEffect, useState } from "react";
import { client } from "../../tina/__generated__/client";
import Image from "next/image";
import Link from "next/link";

//let -disablepesint/no-unused-vars
export const BestParmi = ({ data, parentField }) => {
  const [topParmi, setTopParmi] = useState<TopParmi>({
    score: 0,
    name: "",
    date: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await client.queries.topReviewQuery();
      data = result.data.reviewConnection.edges[0].node;
      console.log(data);

      setTopParmi({
        score: data.score,
        name: data.restaurant.name,
        date: data.date,
        imageUrl: data.parmiImg,
        reviewUrl: data.canonicalUrl,
      });
    };
    fetchData();
  }, []);

  return (
    <Section>
      <Container size="large" className="items-center justify-center">
        <h2 className="text-3xl font-semibold">Best Parmi</h2>
        <div className="card border-2 border-gray-200 rounded-lg p-6 max-w-md mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-start">
          <div className="sm:mb-0 mb-6">
            <h3 className="font-bold text-3xl mb-5">{topParmi?.name}</h3>

            <p className="text-sm text-muted-foreground">
              Date:{" "}
              {new Date(topParmi.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-2xl font-semibold mb-2">
              Score {topParmi.score}/10
            </p>
            <Link
              href={"reviews/" + topParmi?.reviewUrl || "/reviews"}
              className="bg-black text-white rounded-lg p-2 m-1"
            >
              Read Full Review
            </Link>
          </div>

          <Image
            src={topParmi.imageUrl}
            alt="Parmi"
            width={150}
            height={100}
            className="rounded-lg mt-4 md:mt-0 md:ml-10"
          />
        </div>
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
  ],
};

interface TopParmi {
  score: number;
  name: string;
  date: Date;
  imageUrl?: string;
  reviewUrl?: string;
}
