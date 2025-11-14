import React from "react";

interface MapEmbedProps {
  location: string;
  className?: string;
  title?: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ location, className, title }) => {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!location) {
    return <p>No location provided 😔</p>;
  }

  return (
    <iframe
      className={className}
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title ?? `Map showing ${location}`}
      allowFullScreen
      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location}`}
    ></iframe>
  );
};

export default MapEmbed;
