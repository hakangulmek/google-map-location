"use client";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  Autocomplete,
  Polyline,
} from "@react-google-maps/api";
import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "@/contex/locationContex";

// Google Maps API kütüphaneleri
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface Place {
  lat: number;
  lng: number;
  name: string;
}

function GoogleMapView() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [mapKey, setMapKey] = useState(0);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const mapContainerStyle = {
    height: "70vh",
    width: "100%",
  };

  // Default koordinatlar
  const defaultCoordinates = {
    lat: 41.0082, // İstanbul
    lng: 28.9784,
  };

  const { userLocation, isLoading, error } = useLocation();

  // Yön tarifi alma (Routes API ile)
  const getDirections = useCallback(
    async (destination: Place) => {
      if (!userLocation) return;

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

      const body = {
        origin: {
          location: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        languageCode: "tr-TR",
        units: "METRIC",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey || "",
            "X-Goog-FieldMask":
              "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          // Polyline'ı decode etmek için yardımcı fonksiyon
          const decodePolyline = (encoded: string) => {
            // Polyline decode fonksiyonu eklenmeli veya bir paket kullanılmalı
            // Örnek: @mapbox/polyline paketi veya kendi fonksiyonunuz
            return []; // Şimdilik boş, aşağıda örnek verilecek
          };

          setDirections({
            polyline: data.routes[0].polyline.encodedPolyline,
            legs: data.routes[0].legs,
            distance: data.routes[0].distanceMeters,
            duration: data.routes[0].duration, // string olarak kalacak
          });
        } else {
          setDirections(null);
          alert("Rota bulunamadı.");
        }
      } catch (err) {
        setDirections(null);
        alert("Rota alınırken hata oluştu.");
      }
    },
    [userLocation]
  );

  // Autocomplete yüklendiğinde
  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  // Yer seçildiğinde
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry?.location) {
      alert("Seçilen yer için konum bilgisi bulunamadı");
      return;
    }

    const newPlace: Place = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name || place.formatted_address || "Seçilen Yer",
    };

    setSelectedPlace(newPlace);
    setSearchValue(place.name || place.formatted_address || "");

    // Yön tarifi al
    if (userLocation) {
      getDirections(newPlace);
    }
  };

  // Rotayı temizle
  const clearRoute = () => {
    setDirections(null);
    setSelectedPlace(null);
    setSearchValue("");
    setMapKey((prev) => prev + 1); // Haritayı yeniden oluşturur
  };

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

  const mapCenter = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : defaultCoordinates;

  return (
    <div className="space-y-4">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={libraries}
        version="weekly" // veya "beta"
        onLoad={() => setIsMapLoaded(true)}
        onError={() => console.error("Google Maps API yüklenemedi")}
      >
        {/* Arama Kutusu */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Nereye gitmek istiyorsunuz? (ör: Taksim Meydanı, İstanbul)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Autocomplete>
          </div>
          {directions && (
            <button
              onClick={clearRoute}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Rotayı Temizle
            </button>
          )}
        </div>

        {/* Harita */}
        <GoogleMap
          key={mapKey}
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={selectedPlace ? 14 : 10}
        >
          {/* Kullanıcı konumu marker'ı */}
          {userLocation && (
            <MarkerF
              position={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              title="Mevcut Konumunuz"
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize:
                  isMapLoaded && window.google?.maps
                    ? new window.google.maps.Size(40, 40)
                    : undefined,
              }}
            />
          )}

          {/* Seçilen yer marker'ı */}
          {selectedPlace && (
            <MarkerF
              position={{
                lat: selectedPlace.lat,
                lng: selectedPlace.lng,
              }}
              title={selectedPlace.name}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize:
                  isMapLoaded && window.google?.maps
                    ? new window.google.maps.Size(40, 40)
                    : undefined,
              }}
            />
          )}

          {/* Yön tarifi Polyline ile */}
          {directions && directions.polyline ? (
            <Polyline
              key={directions.polyline}
              path={
                directions && directions.polyline
                  ? decodePolyline(directions.polyline)
                  : []
              }
              options={{
                strokeColor: "#2563eb",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              }}
            />
          ) : null}
        </GoogleMap>
      </LoadScript>

      {/* Yön tarifi bilgileri */}
      {directions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Yön Tarifi</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p>
              <strong>Mesafe:</strong> {(directions.distance / 1000).toFixed(2)}{" "}
              km
            </p>
            <p>
              <strong>Süre:</strong>{" "}
              {Math.round(parseDuration(directions.duration) / 60)} dakika
            </p>
          </div>
        </div>
      )}

      {/* Kullanım talimatları */}
      {!userLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Not:</strong> Yön tarifi alabilmek için önce konum izni
            vermeniz gerekiyor.
          </p>
        </div>
      )}
    </div>
  );
}

// Polyline decode fonksiyonu ekleyin (örnek, npm'den @mapbox/polyline da kullanabilirsiniz)
function decodePolyline(encoded: string) {
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

// "1234s" -> 1234 (saniye) çevirici fonksiyon
function parseDuration(durationStr: string) {
  if (!durationStr) return 0;
  const match = durationStr.match(/^(\d+)s$/);
  return match ? parseInt(match[1], 10) : 0;
}

export default GoogleMapView;
