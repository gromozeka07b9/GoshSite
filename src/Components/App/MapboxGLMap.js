import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
    width: "100vw",
    height: "calc(50vh - 80px)",
    position: "flex"
};

const MapboxGLMap = () => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JvbW96ZWthMDdiOSIsImEiOiJja3NodXRqcWIwMHRtMm9sMjBuMWYzNndwIn0.54V3X-nQ9iLcbFvwgnjcGg';
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
                //style: 'mapbox://styles/mapbox/light-v10',
                center: [50, 50],
                zoom: 5
            });

            map.on("load", () => {
                setMap(map);
                map.resize();
                //alert(map.getStyle().layers);
                /*map.setLayoutProperty('state-label', 'text-field', ['get', 'name_ru']);
                map.setLayoutProperty('country-label', 'text-field', ['get', 'name_ru']);
                map.getStyle().layers.forEach(function(thisLayer){
                    console.log(thisLayer);
                    if(thisLayer.id.indexOf('-label')>0){
                        console.log('change '+thisLayer.id);
                        map.setLayoutProperty(thisLayer.id, 'text-field', ['get','name_ru'])
                    }
                });*/
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                }));
                map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
                const nav = new mapboxgl.NavigationControl();
                map.addControl(nav, 'top-left');
                // Create a new marker.
                const marker = new mapboxgl.Marker()
                    .setLngLat([30.5, 50.5])
                    .addTo(map);
            });
        };

        if (!map) initializeMap({ setMap, mapContainer });
    }, [map]);

    return <div ref={el => (mapContainer.current = el)} style={styles} />;
};

export default MapboxGLMap;