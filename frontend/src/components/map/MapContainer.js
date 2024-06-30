import React, { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

import { fromLonLat, transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point, LineString } from "ol/geom";
import { Feature } from "ol";
//style
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import { Container, Box, Flex } from "@chakra-ui/react";
import "ol/ol.css";

import MarkerDescription from "./MarkerDescription";
import ControlPanel from "./ControlPanel";
import Sidebar from "./Sidebar";

const MapContainer = () => {
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [isMarking, setIsMarking] = useState(false);
  const [editingMarker, setEditingMarker] = useState(null);
  const [route, setRoute] = useState(null);
  const [processedRouteData, setProcessedRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapElement = useRef();

  useEffect(() => {
    const thunderforestKey = "2e860100ee4646f0afae42c64ab8380a";

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        // new TileLayer({
        //   source: new OSM(),
        // }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=${thunderforestKey}`,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([120.846642, 23.488793]),
        zoom: 8.4,
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
          scale: 0.25,
          src: "https://cdn-icons-png.flaticon.com/128/4210/4210204.png",
        }),
      })
    );

    const updatedMarkers = [
      ...markers,
      { feature: newMarker, id, title: "", description: "" },
    ];
    setMarkers(updatedMarkers);
    updateMapLayers([
      ...updatedMarkers,
      ...(route ? [{ feature: route, id: "route" }] : []),
    ]);
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
    if (markers.length < 2) return;

    setIsLoading(true);

    const coordinates = markers.map((marker) =>
      transform(
        marker.feature.getGeometry().getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      )
    );

    let url = "https://router.project-osrm.org/route/v1/driving/";
    url += coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(";");
    url += "?overview=full&geometries=geojson&steps=true";

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routeCoords = route.geometry.coordinates.map((coord) =>
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

        // console.log(route);
        const processedData = await processRouteData(route);
        console.log(processedData);
        setProcessedRouteData(processedData);

        updateMapLayers([...markers, { feature: routeFeature, id: "route" }]);
      }
    } catch (error) {
      console.error("計算路線發生錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //處理路線數據
  const processRouteData = async (route) => {
    const latAndLonConversion = await Promise.all(
      route.legs.map(async (leg, index) => {
        const startPoint = leg.steps[0].maneuver.location;
        const endPoint = leg.steps[leg.steps.length - 1].maneuver.location;

        const startName = await reverseGeocode(startPoint[1], startPoint[0]);
        const endName = await reverseGeocode(endPoint[1], endPoint[0]);

        return {
          index,
          startName,
          endName,
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.map((step) => ({
            distance: step.distance,
            duration: step.duration,
            name: step.name,
            drivingSide: step.maneuver.modifier,
          })),
        };
      })
    );
    return {
      legs: latAndLonConversion,
      totalDistance: route.distance,
      totalDuration: route.duration,
    };
  };

  //使用Nominatim API 經緯度轉換為城市名
  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const addressSplit = data.display_name.split(", ");
      const taiwanIndex = addressSplit.findIndex((str) => str === "臺灣");
      const deleteAddress = addressSplit.slice(0, taiwanIndex - 1);
      const reverseAddress = deleteAddress.reverse().join("");
      return reverseAddress || "未知地點";
    } catch (error) {
      console.log("反向地理編碼錯誤", error);
    }
  };

  //清除路線
  const clearRoute = () => {
    setProcessedRouteData(null);
    setRoute(null);
    updateMapLayers(markers);
  };
  //清除
  const clearAll = () => {
    setMarkers([]);
    console.log(markers);
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
          scale: 0.25,
          src: "https://cdn-icons-png.flaticon.com/128/4210/4210204.png",
        }),
        text: new Text({
          text: updatedMarker.title,
          offsetY: -10,
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

    updateMapLayers(
      updatedMarkers,
      ...(route ? [{ feature: route, id: "route" }] : [])
    );
  };

  const toggleMarking = () => {
    setIsMarking(!isMarking);
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h="100vh" w="100%">
        <Box
          position="absolute"
          left="0"
          w="320px"
          maxHeight="80%"
          bg="white"
          boxShadow="md"
          zIndex={1}
          overflowY="auto"
        >
          <Sidebar
            isLoading={isLoading}
            route={route}
            processedRouteData={processedRouteData}
          ></Sidebar>
        </Box>

        <Box
          position="absolute"
          zIndex={2}
          right="0"
          // top="40%"
          bg="#E2E8F0"
          borderRadius="lg"
          boxShadow="md"
          borderWidth={2}
          borderColor="gray.200"
        >
          {editingMarker && (
            <MarkerDescription
              marker={editingMarker}
              onSave={saveMarkerDescription}
              onCancel={() => setEditingMarker(null)}
              onDelete={deleteMarker}
            />
          )}
        </Box>
        <Box flex="1" position="relative">
          <ControlPanel
            isMarking={isMarking}
            toggleMarking={toggleMarking}
            //確保是布林值
            hasRoute={!!route}
            clearRoute={clearRoute}
            calculateRoute={calculateRoute}
            clearAll={clearAll}
          />
          <Box
            ref={mapElement}
            h="100%"
            position="abstract"
            top={0}
            left={0}
            right={0}
            bottom={0}
          />
        </Box>
      </Flex>
    </Container>
  );
};

export default MapContainer;
