import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";

export const Layout = ({ rawData = {}, data = layoutData, children }) => {
  return (
    <>
      <Head>
        <title>Parmi Picks</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Chicken parmi reviews - my personal list of every parmi I've tried and rated. Browse through my reviews to find the best"
          key="desc"
        />
        <meta property="og:title" content="Parmi Picks" />
        <meta
          property="og:description"
          content="Reviews of every parmi I've tried and reviews. Browse through my reviews to find the best"
        />
        <meta
          property="og:image"
          content="https://assets.tina.io/c68a0182-b88f-4a74-8514-0cbe71f98577/nice-parm.jpg"
        />
      </Head>
      <div>
        <Header data={data?.header} />
        <div className="flex-1 text-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-1000 flex flex-col">
          {children}
        </div>
        <Footer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawData={rawData as any}
          data={data?.footer}
          icon={data?.header.icon}
        />
      </div>
    </>
  );
};
