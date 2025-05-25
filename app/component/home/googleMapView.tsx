import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React from "react";

function googleMapView() {
  const mapContainerStyle = {
    height: "70vh",
    width: "100%",
  };
  const cordinates = {
    lat: -34.0522,
    lng: 150.644,
  };
  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={cordinates}
          zoom={16}
        ></GoogleMap>
      </LoadScript>
    </div>
  );
}

export default googleMapView;
