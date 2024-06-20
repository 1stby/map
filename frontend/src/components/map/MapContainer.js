import React, { useRef, useEffect, useState } from "react";

import { Feature, Map, Tile, View } from "ol";
import { fromLonLat } from "ol/proj";
import { Point, LineString } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Stroke } from "ol/style";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import "ol/ol.css";
import "./Map.css";

const MapContainer = () => {
  const [map, setMap] = useState();
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  // 創建 OpenStreetMap 瓦片圖層
  const osmLayer = new TileLayer({
    preload: Infinity,
    source: new OSM(),
  });
  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: [osmLayer],
      view: new View({
        center: fromLonLat([120.846642, 23.488793]),
        zoom: 7,
      }),
    });

    setMap(initialMap);

    // 返回清理函數
    return () => {
      initialMap.setTarget(null);
      initialMap.dispose();
    };
  }, []);

  return <div ref={mapElement} className="map-container"></div>;
};

export default MapContainer;
