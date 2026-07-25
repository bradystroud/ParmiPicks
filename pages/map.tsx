import Head from "next/head";
import dynamic from "next/dynamic";
import { Layout } from "../components/layout";
import { Section } from "../components/util/section";
import { Container } from "../components/util/container";
import { client } from "../tina/__generated__/client";
import type { MapLocation, MapReview } from "../components/Map";

// Not named `Map` so it doesn't shadow the built-in Map constructor below.
const ParmiMap = dynamic(() => import("../components/Map"), { ssr: false });

// Geocoding is a server-side REST call made at build time, so it can use a key
// that is never shipped to the browser. That matters because the browser key
// has to stay referrer-restricted, and a referrer-restricted key is rejected by
// the REST API. Falls back to the public key so the build still works if the
// server-only key isn't configured.
const GEOCODING_API_KEY =
  process.env.GOOGLE_GEOCODING_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GEOCODING_API_KEY}`
    );
    const data = await response.json();
    const location = data.results?.[0]?.geometry?.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (err) {
    console.error(`Failed to geocode "${address}":`, err);
    return null;
  }
}

// Geocoding runs at build time and is refreshed via ISR rather than on every
// request, so visitors never wait on a fan-out of Google API calls.
export async function getStaticProps() {
  if (!GEOCODING_API_KEY) {
    // Without a key every lookup fails and the map renders empty, which is easy
    // to miss in a green build (PR previews don't get the secret).
    console.warn(
      "No geocoding API key configured — /map will be built with no pins."
    );
  }

  const reviewsListData = await client.queries.reviewConnection();

  // Group by the address we'd geocode: revisits to the same venue resolve to
  // identical coordinates and would otherwise render as pins stacked exactly on
  // top of one another. Grouping first also saves a geocode call per duplicate.
  const byAddress: Record<string, { name: string; reviews: MapReview[] }> = {};

  for (const review of reviewsListData.data.reviewConnection.edges) {
    const restaurant = review.node.restaurant;
    // Skip reviews with no linked restaurant (e.g. an auto-generated draft)
    // so a single incomplete review can't crash the build.
    if (!restaurant) continue;

    const address = restaurant.location || restaurant.name;
    if (!address) continue;

    const group = (byAddress[address] ??= {
      name: restaurant.name,
      reviews: [],
    });
    group.reviews.push({
      url: review.node._sys.filename,
      score: review.node.score,
      date: review.node.date,
    });
  }

  const locations = (
    await Promise.all(
      Object.keys(byAddress).map(async (address) => {
        const group = byAddress[address];
        const coords = await geocode(address);
        if (!coords) return null;

        return {
          name: group.name,
          lat: coords.lat,
          lng: coords.lng,
          reviews: [...group.reviews].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        } satisfies MapLocation;
      })
    )
  ).filter((location): location is MapLocation => location !== null);

  return {
    props: {
      locations,
    },
    revalidate: 60 * 60 * 24, // refresh geocodes daily
  };
}

const MapPage = ({ locations }: { locations: MapLocation[] }) => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand">
              Plan your next visit
            </p>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Parmi locations</h1>
            <p className="text-base text-slate-600">
              Discover every pub we&apos;ve reviewed on an interactive map. Tap a marker to jump straight to the review and get the full verdict.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-xl shadow-amber-100/40">
            <ParmiMap locations={locations} />
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default MapPage;
