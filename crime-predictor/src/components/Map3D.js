import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { ColumnLayer } from "@deck.gl/layers";

const Map3D = ({ data }) => {
    const [tooltip, setTooltip] = useState(null);

    const INITIAL_VIEW_STATE = {
        longitude: -87.6298,
        latitude: 41.8781,
        zoom: 11,
        pitch: 45,
        bearing: 0,
    };

    const columnsData = data.map(area => ({
        position: [area.longitude, area.latitude],
        height: area["Scaled Predicted Crime Count"],
        radius: 250,
        color: [255, 99, 71], // Can be updated to use color coding logic
        community_area: area["AREA_NUMBE"], // Tooltip data
        crime_count: area["Scaled Predicted Crime Count"], // Tooltip data
    }));

    const columnLayer = new ColumnLayer({
        id: 'crime-bars',
        data: columnsData,
        diskResolution: 12,
        radius: 250,
        elevationScale: 5,
        getPosition: d => d.position,
        getFillColor: d => d.color,
        getElevation: d => d.height,
        pickable: true,
        onHover: ({ x, y, object }) => {
            if (object) {
                setTooltip({
                    x,
                    y,
                    content: `
                        <div>
                            <strong>Community Area:</strong> ${object.community_area} <br/>
                            <strong>Crime Count:</strong> ${Math.round(object.crime_count)}
                        </div>
                    `,
                });
            } else {
                setTooltip(null);
            }
        },
    });

    return (
        <>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={[columnLayer]}
            >
                <Map 
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
                    mapboxAccessToken='pk.eyJ1IjoiYW51cHJhamciLCJhIjoiY200amY3NW84MGU3djJrcjM3Yzc1cnNwYSJ9.ZPWTU3P2oMms3eVZCPUabg'
                />
            </DeckGL>

            {tooltip && (
                <div 
                    className={`tooltip show`} 
                    style={{ 
                        left: tooltip.x + 10, 
                        top: tooltip.y + 10 
                    }}
                    dangerouslySetInnerHTML={{ __html: tooltip.content }} 
                />
            )}
        </>
    );
};

export default Map3D;
