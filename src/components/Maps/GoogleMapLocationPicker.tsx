"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapLocationPickerProps {
  initialLocation?: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 9.0765, // Nigeria approximate center
  lng: 7.3986,
};

const GoogleMapLocationPicker: React.FC<GoogleMapLocationPickerProps> = ({
  initialLocation,
  onLocationSelect,
  height = "500px",
  width = "100%",
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  if (!isLoaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading map...</span>
          </div>
          <p className="mt-2">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height, width }}
        center={selectedLocation || defaultCenter}
        zoom={selectedLocation ? 15 : 6}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>

      <div className="position-absolute bottom-0 start-0 m-3">
        <div className="alert alert-info mb-0 p-2">
          <small>
            <strong>Instructions:</strong> Click on the map to select a location
            {selectedLocation && (
              <div className="mt-1">
                Selected: {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </div>
            )}
          </small>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapLocationPicker;
