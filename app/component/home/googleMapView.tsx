"use client";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import React from "react";
import { useLocation } from "@/contex/locationContex";

function GoogleMapView() {
  const mapContainerStyle = {
    height: "70vh",
    width: "100%",
  };

  // Default koordinatlar (kullanıcı konumu alınamazsa)
  const defaultCoordinates = {
    lat: -34.0522,
    lng: 150.644,
  };

  const { userLocation, isLoading, error } = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Konum alınıyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Hata:</strong> {error}
      </div>
    );
  }

  // Kullanıcı konumu varsa onu kullan, yoksa default koordinatları kullan
  const mapCenter = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : defaultCoordinates;

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={16}
        >
          {userLocation && (
            <MarkerF
              position={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              title="Mevcut Konumunuz"
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
