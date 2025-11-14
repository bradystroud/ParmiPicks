import Head from "next/head";
import dynamic from "next/dynamic";
import fetch from "node-fetch";
import { Layout } from "../components/layout";
import { Section } from "../components/util/section";
import { Container } from "../components/util/container";
import { client } from "../tina/__generated__/client";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getServerSideProps() {
  const reviewsListData = await client.queries.reviewConnection();

  const locations = await Promise.all(
    reviewsListData.data.reviewConnection.edges.map(async (review) => {
      const restaurant = review.node.restaurant;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          restaurant.location
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      const location = data.results[0]?.geometry.location;

      return {
        name: restaurant.name,
        lat: location?.lat || 0,
        lng: location?.lng || 0,
        review: {
          url: review.node._sys.filename,
          score: review.node.score,
          date: review.node.date,
          restaurant: review.node.restaurant.name,
        },
      };
    })
  );

  return {
    props: {
      locations,
    },
  };
}

const MapPage = ({ locations }) => {
  const pageTitle = "Parmi Picks | Map";

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <link rel="canonical" href="https://parmipicks.com/map" key="canonical" />
      </Head>
      <Section className="flex-1">
        <Container size="large" className="max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">
              Plan your next visit
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Parmi locations</h1>
            <p className="text-base text-slate-600">
              Discover every pub we&apos;ve reviewed on an interactive map. Tap a marker to jump straight to the review and get the full verdict.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-xl shadow-amber-100/40">
            <Map locations={locations} />
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default MapPage;
