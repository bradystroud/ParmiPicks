import { client } from '../tina/__generated__/client';
// import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import fetch from 'node-fetch';

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getServerSideProps() {
  const reviewsListData = await client.queries.reviewConnection();
  
  const locations = await Promise.all(reviewsListData.data.reviewConnection.edges.map(async (review) => {
    
    const restaurant = review.node.restaurant;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(restaurant.location)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    const location = data.results[0]?.geometry.location;
    console.log(location);
    
    return {
      name: restaurant.name,
      lat: location?.lat || 0,
      lng: location?.lng || 0,
      review: {
        url: review.node._sys.filename,
        score: review.node.score,
        date: review.node.date,
        restaurant: review.node.restaurant.name,
      }
    };
  }));

  return {
    props: {
      locations,
    },
  };
}

const MapPage = ({ locations }) => {
  return (
    <div>
      <h1>Parmi Locations</h1>
      <Map locations={locations} />
    </div>
  );
};

export default MapPage; 