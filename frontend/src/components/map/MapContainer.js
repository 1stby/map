import React, { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Style, Icon } from "ol/style";
import "ol/ol.css";
import "./Map.css";

const MapContainer = () => {
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [isMarking, setIsMarking] = useState(false);
  const mapElement = useRef();

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([120.846642, 23.488793]),
        zoom: 7.5,
      }),
    });

    setMap(initialMap);
    return () => initialMap.setTarget(null);
  }, []);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e) => {
      if (isMarking) {
        const clickCoord = map.getCoordinateFromPixel(e.pixel);
        addMarker(clickCoord);
        setIsMarking(false);
      }
    };

    map.on("click", handleClick);
    return () => map.un("click", handleClick);
  }, [map, isMarking]);

  const addMarker = (coord) => {
    const id = Date.now().toString();
    const newMarker = new Feature({
      geometry: new Point(coord),
    });

    newMarker.setId(id);
    newMarker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      })
    );

    const updatedMarkers = [...markers, { feature: newMarker, id }];
    setMarkers(updatedMarkers);
    updateMapLayers(updatedMarkers);
  };

  const updateMapLayers = (markersToUpdate) => {
    const vectorSource = new VectorSource({
      features: markersToUpdate.map((m) => m.feature),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map
      .getLayers()
      .getArray()
      .filter((layer) => layer instanceof VectorLayer)
      .forEach((layer) => map.removeLayer(layer));

    map.addLayer(vectorLayer);
  };

  const toggleMarking = () => {
    setIsMarking(!isMarking);
  };

  return (
    <div className="map-container">
      <div ref={mapElement} className="map"></div>
      <button className="mark-button" onClick={toggleMarking}>
        {isMarking ? "取消標記" : "開始標記"}
      </button>
    </div>
  );
};

export default MapContainer;
