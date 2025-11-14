import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import router from "next/router";
import { useCallback, useRef, useState } from 'react';

const containerStyle = {
  width: "100%",
  height: "70vh",
};

const defaultCenter = {
  lat: 0,
  lng: 0
};

const Map = ({ locations }) => {
  const mapRef = useRef(null);
  const [hoveredReview, setHoveredReview] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);

  // Function to fit bounds to all markers
  const fitBounds = () => {
    if (mapRef.current && locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      // Extend bounds with each location
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });

      // Fit the map to the bounds
      mapRef.current.fitBounds(bounds);

      // Optional: if you have only one marker, you might want to set a zoom level
      if (locations.length === 1) {
        mapRef.current.setZoom(14);
      }
    }
  };

  // Handle map load
  const onLoad = (map) => {
    mapRef.current = map;
    fitBounds();
  };

  const handleMarkerClick = useCallback((latLng, review) => {
    if (!mapRef.current) return;
    mapRef.current.panTo(latLng);
    // Maybe navigate to the review page like this:
    router.push(`/reviews/${review.url}`);
  }, []);

  // Handle marker hover - show a preview of the review
  const handleMarkerHover = useCallback((location) => {
    setHoveredReview(location);
  }, []);

  const handleMarkerOut = useCallback(() => {
    setHoveredReview(null);
  }, []);

  const onZoomChanged = () => {
    if (mapRef.current) {
      setZoomLevel(mapRef.current.getZoom());
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={zoomLevel}
        onLoad={onLoad}
        onZoomChanged={onZoomChanged}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            onClick={() => handleMarkerClick({ lat: location.lat, lng: location.lng }, location.review)}
            onMouseOver={() => handleMarkerHover(location)}
            onMouseOut={handleMarkerOut}
          />
        ))}
        {hoveredReview && (
          <InfoWindow
            position={{ lat: hoveredReview.lat + 7 / zoomLevel, lng: hoveredReview.lng }}
            onCloseClick={handleMarkerOut}
          >
            <div>
              <h3>{hoveredReview.name} - {hoveredReview.review.score}</h3>
              <p>Date: {new Date(hoveredReview.review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p>click to view</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
