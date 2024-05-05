import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CityContext";
import useGeolocation from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrPosition } from "../hooks/useUrPosition";

export default function Map() {
  const {
    position: geolocationPosition,
    isLoading: isLoadingGeo,
    getPosition,
  } = useGeolocation();
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { lat, lng } = useUrPosition();
  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );
  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingGeo ? "Loading..." : "Use your position"}
      </Button>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={3}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>
                {cities.emoji} {cities.city}
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <MapClick />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function MapClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
