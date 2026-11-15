
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultPosition = [22.7196, 75.8577]; // Indore

// Approximate geographical bounds of India.
const indiaBounds = [
  [6.5, 68.0],
  [37.5, 97.5],
];

const text = {
  en: {
    locationHint:
      "Click anywhere on the map to mark the issue location.",
    latitude: "Latitude",
    longitude: "Longitude",
  },
  hi: {
    locationHint:
      "समस्या का स्थान चुनने के लिए मैप पर कहीं भी क्लिक करें।",
    latitude: "अक्षांश",
    longitude: "देशांतर",
  },
};

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

// Approximate India bounds validation.
function isInsideIndia([lat, lng]) {
  return (
    lat >= 6.5 &&
    lat <= 37.5 &&
    lng >= 68.0 &&
    lng <= 97.5
  );
}

// Moves the map whenever the selected address changes.
function MapPositionUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom(), {
      animate: true,
    });
  }, [map, position[0], position[1]]);

  return null;
}

// Handles clicks on the map.
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
  lang = "en",
}) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = text[currentLang];

  const mapPosition = position || defaultPosition;

  function selectLocation(nextPosition) {
    if (!isInsideIndia(nextPosition)) {
      return;
    }

    onChange(nextPosition);
  }

  return (
    <div className="location-picker">
      <p className="location-hint">
        {t.locationHint}
      </p>

      <MapContainer
        center={mapPosition}
        zoom={5}
        minZoom={4}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        className="issue-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapPositionUpdater position={mapPosition} />

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
        {t.latitude}: {mapPosition[0].toFixed(6)} ·{" "}
        {t.longitude}: {mapPosition[1].toFixed(6)}
      </p>
    </div>
  );
}
