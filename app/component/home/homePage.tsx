import React from "react";

import RestaurantCard from "./restaurantCard";
import GoogleMapView from "./googleMapView";

function HomePage({ restaurants }: { restaurants: any[] }) {
  return (
    <div>
      <GoogleMapView />
      <div className="mt-6">
        <RestaurantCard restaurants={restaurants} />
      </div>
    </div>
  );
}

export default HomePage;
