
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultPosition = [22.7196, 75.8577]; // Indore

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}

export default function LocationPicker({
  position,
  onChange,
}) {
  const [mapPosition, setMapPosition] = useState(
    position || defaultPosition
  );

  function selectLocation(nextPosition) {
    setMapPosition(nextPosition);
    onChange(nextPosition);
  }

  return (
    <div className="location-picker">
      <p className="location-hint">
        Click anywhere on the map to mark the issue location.
      </p>

      <MapContainer
        center={mapPosition}
        zoom={14}
        scrollWheelZoom
        className="issue-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelect={selectLocation}
        />

        <Marker
          position={mapPosition}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const marker = event.target;
              const point = marker.getLatLng();

              selectLocation([point.lat, point.lng]);
            },
          }}
        />
      </MapContainer>

      <p className="coordinates-text">
        Latitude: {mapPosition[0].toFixed(6)} ·
        Longitude: {mapPosition[1].toFixed(6)}
      </p>
    </div>
  );
}
