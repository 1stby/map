import React, { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point, LineString } from "ol/geom";
import { Feature } from "ol";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import "ol/ol.css";
import "./Map.css";

const MapContainer = () => {
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [isMarking, setIsMarking] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
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
      } else {
        const feature = map.forEachFeatureAtPixel(
          e.pixel,
          (feature) => feature
        );
        if (feature) {
          const marker = markers.find((m) => m.feature === feature);
          if (marker) {
            setEditingMarker(marker);
          }
        }
      }
    };

    map.on("click", handleClick);
    return () => map.un("click", handleClick);
  }, [map, isMarking, markers]);

  //新增標記
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

    const updatedMarkers = [
      ...markers,
      { feature: newMarker, id, title: "", description: "" },
    ];
    setMarkers(updatedMarkers);
    updateMapLayers(updatedMarkers);
  };
  //刪除標記
  const deleteMarker = (markerId) => {
    const updatedMarkers = markers.filter((m) => m.id !== markerId);
    setMarkers(updatedMarkers);
    updateMapLayers(updatedMarkers);
    setEditingMarker(null);
  };
  //建立路線
  const calculateRoute = async () => {
    if (markers.length !== 2) return;

    const start = markers[0].feature.getGeometry().getCoordinates();
    const end = markers[1].feature.getGeometry().getCoordinates();

    const startLonLat = transform(start, "EPSG:3857", "EPSG:4326");
    const endLonLat = transform(end, "EPSG:3857", "EPSG:4326");

    const url = `https://router.project-osrm.org/route/v1/driving/${startLonLat[0]},${startLonLat[1]};${endLonLat[0]},${endLonLat[1]}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeCoords = data.routes[0].geometry.coordinates.map((coord) =>
          fromLonLat(coord)
        );
        const lineString = new LineString(routeCoords);

        const routeFeature = new Feature({
          geometry: lineString,
          name: "Route",
        });

        routeFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: "#66c2a5",
              width: 4,
            }),
          })
        );

        setRoute(routeFeature);
        setDistance(data.routes[0].distance / 1000); //公里
        updateMapLayers([...markers, { feature: routeFeature, id: "route" }]);
      }
    } catch (error) {
      console.error("計算路線發生錯誤:", error);
    }
  };
  //清除路線
  const clearRoute = () => {
    setRoute(null);
    setDistance(null);
    updateMapLayers(markers);
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
  //標點的描述
  const saveMarkerDescription = (updatedMarker) => {
    const updatedMarkers = markers.map((m) =>
      m.id === updatedMarker.id ? { ...m, ...updatedMarker } : m
    );
    setMarkers(updatedMarkers);
    setEditingMarker(null);

    const feature = updatedMarkers.find(
      (m) => m.id === updatedMarker.id
    ).feature;
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
        text: new Text({
          text: updatedMarker.title,
          offsetY: -15,
          fill: new Fill({
            color: "#000",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );

    updateMapLayers(updatedMarkers);
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
      {markers.length === 2 && !route && (
        <button className="route-button" onClick={calculateRoute}>
          計算路線
        </button>
      )}
      {route && (
        <div className="route-info">
          <p>距離: {distance.toFixed(2)} km</p>
          <button onClick={clearRoute}>清除路線</button>
        </div>
      )}
      {editingMarker && (
        <MarkerDescription
          marker={editingMarker}
          onSave={saveMarkerDescription}
          onCancel={() => setEditingMarker(null)}
          onDelete={deleteMarker}
        />
      )}
    </div>
  );
};

//標點描述的組件
const MarkerDescription = ({ marker, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(marker.title || "");
  const [description, setDescription] = useState(marker.description || "");

  const handleSave = () => {
    onSave({ ...marker, title, description });
  };
  const handleDelete = () => {
    if (window.confirm("確定刪除這個標記嗎？")) {
      onDelete(marker.id);
    }
  };
  return (
    <div className="marker-description">
      <h3>編輯標記</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="標題"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述內容"
      />
      <button onClick={handleSave}>保存</button>
      <button onClick={onCancel}>取消</button>
      <button onClick={handleDelete} className="delete-button">
        刪除標記
      </button>
    </div>
  );
};

export default MapContainer;
