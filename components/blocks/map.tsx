import React from "react";

interface MapEmbedProps {
  location: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ location }) => {
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  if (!location) {
    return <p>No location provided 😔</p>;
  }

  return (
    <iframe
      width="600"
      height="450"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${location}`}
    ></iframe>
  );
};

export default MapEmbed;
