import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const Map = ({ data }) => {
    const center = [41.8781, -87.6298]; // Chicago coordinates

    const HeatMapLayer = () => {
        const map = useMap();

        useEffect(() => {
            if (!Array.isArray(data)) {
                console.error("Data is not an array", data);
                return;
            }

            const heatmapData = data
                .filter(area => area.latitude && area.longitude)
                .map(area => [
                    area.latitude, 
                    area.longitude, 
                    area["Scaled Predicted Crime Count"] / 1000 // Normalize intensity
                ]);

            const heatLayer = L.heatLayer(heatmapData, {
                radius: 20,
                blur: 15,
                maxZoom: 17
            });

            heatLayer.addTo(map);

            // Clean up heat layer when component unmounts
            return () => {
                map.removeLayer(heatLayer);
            };
        }, [data, map]);

        return null;
    };

    return (
        <MapContainer center={center} zoom={11} style={{ height: "80vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <HeatMapLayer />
        </MapContainer>
    );
};

export default Map;
