import React from "react";
import Head from "next/head";
import { Header } from "./header";
import { Footer } from "./footer";
import layoutData from "../../content/global/index.json";
import { Theme } from "./theme";

export const Layout = ({ rawData = {}, data = layoutData, children }) => {
  return (
    <>
      <Head>
        <title>Parmi Picks</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Theme data={data?.theme}>
        <div
        // className={`min-h-screen flex flex-col ${
        //   data.theme.font === "nunito" && "font-nunito"
        // } ${data.theme.font === "lato" && "font-lato"} ${
        //   data.theme.font === "sans" && "font-sans"
        // }`}
        >
          <Header data={data?.header} />
          <div className="flex-1 text-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-1000 flex flex-col">
            {children}
          </div>
          <Footer
            rawData={rawData}
            data={data?.footer}
            icon={data?.header.icon}
          />
        </div>
      </Theme>
    </>
  );
};
