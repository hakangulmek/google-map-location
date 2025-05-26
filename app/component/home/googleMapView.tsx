"use client";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import React, { useState, useCallback } from "react";
import { useLocation } from "@/contex/locationContex";

function GoogleMapView() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapContainerStyle = {
    height: "70vh",
    width: "100%",
  };

  // Default koordinatlar (kullanıcı konumu alınamazsa)
  const defaultCoordinates = {
    lat: 41.0082, // İstanbul koordinatları
    lng: 28.9784,
  };

  const { userLocation, isLoading, error } = useLocation();

  // LoadScript callbacks
  const onLoad = useCallback(() => {
    console.log("Google Maps API yüklendi");
    setMapLoaded(true);
  }, []);

  const onError = useCallback((error: unknown) => {
    console.error("Google Maps API yükleme hatası:", error);
    setMapError("Google Maps yüklenemedi. API anahtarınızı kontrol edin.");
  }, []);

  // Timeout ile fallback
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Konum alma işlemi zaman aşımına uğradı");
      }
    }, 10000); // 10 saniye timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // API key kontrolü
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log("API Key var mı:", !!apiKey);
  console.log("API Key ilk 10 karakter:", apiKey?.substring(0, 10));

  if (!apiKey) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Hata:</strong> Google Maps API anahtarı bulunamadı. .env.local
        dosyanızda NEXT_PUBLIC_GOOGLE_MAPS_API_KEY tanımlı olduğundan emin olun.
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Hata:</strong> {mapError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-lg">
          Konum alınıyor...
          <br />
          <small className="text-sm text-gray-600">
            Konum izni verdiğinizden emin olun
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <strong>Uyarı:</strong> {error}
        <br />
        <small>Varsayılan konum kullanılacak.</small>
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
        googleMapsApiKey={apiKey}
        onLoad={onLoad}
        onError={onError}
        loadingElement={
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-lg ml-4">Google Maps yükleniyor...</div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={userLocation ? 16 : 10}
          onLoad={() => console.log("Harita yüklendi")}
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

          {/* Eğer kullanıcı konumu yoksa default konuma marker koy */}
          {!userLocation && (
            <MarkerF position={defaultCoordinates} title="Varsayılan Konum" />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default GoogleMapView;
