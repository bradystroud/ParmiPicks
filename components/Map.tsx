import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import router from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "70vh",
};

// Centre roughly on Australia so the first paint isn't the middle of the
// ocean while we wait for fitBounds to run.
const defaultCenter = {
  lat: -25.27,
  lng: 133.77,
};

export interface MapReview {
  url: string;
  score: number;
  date: string;
}

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  // Newest first, never empty. A venue can be reviewed more than once (a
  // revisit), and those reviews geocode to identical coordinates — so they are
  // grouped into one pin rather than stacked invisibly on top of each other.
  reviews: MapReview[];
}

const formatReviewDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AU", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Brand-orange map pin, with room for the score label to sit inside the head.
// Leaflet/Google symbols take a raw colour string, so this is the one place the
// brand hex can't be a Tailwind token — keep it in sync with theme.colors.brand.
const pinIcon = (): google.maps.Symbol => ({
  path: "M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z",
  fillColor: "#d85530",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 2,
  scale: 1.4,
  anchor: new google.maps.Point(12, 36),
  labelOrigin: new google.maps.Point(12, 12),
});

const Map = ({ locations }: { locations: MapLocation[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<MapLocation | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  // Ignore any locations that failed to geocode (they'd otherwise pin to
  // 0,0 off the coast of Africa and blow out the bounds).
  const validLocations = useMemo(
    () => locations.filter((l) => l.lat !== 0 || l.lng !== 0),
    [locations]
  );

  const fitBounds = useCallback(
    (map: google.maps.Map) => {
      if (validLocations.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      validLocations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds, 64);

      // A single marker fits to an extreme zoom; pull it back to something sane.
      if (validLocations.length === 1) {
        map.setZoom(14);
      }
    },
    [validLocations]
  );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      fitBounds(map);
    },
    [fitBounds]
  );

  const handleMarkerClick = useCallback((location: MapLocation) => {
    setSelected(location);
    mapRef.current?.panTo({ lat: location.lat, lng: location.lng });
  }, []);

  if (loadError) {
    return (
      <div
        style={containerStyle}
        className="flex items-center justify-center bg-amber-50 text-slate-600"
      >
        <p>Sorry, the map couldn&apos;t load right now. 🫤</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={containerStyle}
        className="flex items-center justify-center bg-amber-50 text-slate-500"
      >
        <p className="animate-pulse">Loading the parmi map…</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={4}
      onLoad={onLoad}
      onClick={() => setSelected(null)}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
      }}
      aria-label="Map showing reviewed parmi locations"
    >
      {validLocations.map((location) => (
        <MarkerF
          key={location.reviews[0].url}
          position={{ lat: location.lat, lng: location.lng }}
          title={`${location.name} — ${location.reviews[0].score}`}
          icon={pinIcon()}
          label={{
            text: String(location.reviews[0].score),
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "700",
          }}
          onClick={() => handleMarkerClick(location)}
        />
      ))}

      {selected && (
        <InfoWindowF
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
          options={{ pixelOffset: new google.maps.Size(0, -38) }}
        >
          <div className="min-w-[180px] max-w-[240px] p-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {selected.reviews[0].score}
              </span>
              <h3 className="text-base font-semibold leading-tight text-slate-900">
                {selected.name}
              </h3>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Reviewed {formatReviewDate(selected.reviews[0].date)}
            </p>
            <button
              type="button"
              onClick={() => router.push(`/reviews/${selected.reviews[0].url}`)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Read the review →
            </button>

            {selected.reviews.length > 1 && (
              <div className="mt-3 border-t border-slate-200 pt-2">
                <p className="text-xs font-semibold text-slate-500">
                  Earlier visits
                </p>
                <ul className="mt-1 space-y-1">
                  {selected.reviews.slice(1).map((review) => (
                    <li key={review.url}>
                      <button
                        type="button"
                        onClick={() => router.push(`/reviews/${review.url}`)}
                        className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-xs text-slate-600 transition hover:bg-amber-50 hover:text-slate-900"
                      >
                        <span className="font-bold text-brand">
                          {review.score}
                        </span>
                        <span>{formatReviewDate(review.date)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default Map;
