import React, { useRef, useEffect, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point, LineString } from "ol/geom";
import { Feature } from "ol";
//style
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import {
  Container,
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  List,
  ListItem,
  ListIcon,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { MapPin, Route, Trash2, CornerUpRight, CircleX } from "lucide-react";
import "ol/ol.css";

import MarkerDescription from "./MarkerDescription";

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

    updateMapLayers(updatedMarkers);
  };

  //方向處裡
  const drivingSide = (drivingSide) => {
    const turn = ["right", "left", "slight right", "slight left"];
    if (
      turn.some((condition) => drivingSide.toLowerCase().includes(condition))
    ) {
      return `turn ${drivingSide}`;
    }
    return drivingSide;
  };

  const toggleMarking = () => {
    setIsMarking(!isMarking);
  };

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h="100vh" w="100%">
        <Flex
          direction="column"
          w="320px"
          me="12px"
          bg="white"
          boxShadow="md"
          zIndex={1}
          overflowY="auto"
        >
          {/* 這裡放置你的側邊欄內容 */}
          <Box p={4} bg="gray.100" m={4}>
            {isLoading ? (
              <ChakraText>路線計算中...</ChakraText>
            ) : route && processedRouteData ? (
              <>
                <Heading size="lg" mb={2}>
                  路線概覽
                </Heading>
                <Flex justify="space-between" align="center">
                  <Box>
                    <ChakraText fontSize="xl" fontWeight="bold">
                      總距離:
                      {(processedRouteData.totalDistance / 1000).toFixed(2)} KM
                    </ChakraText>
                    <ChakraText fontSize="lg">
                      預計時間:{" "}
                      {(processedRouteData.totalDuration / 60).toFixed(0)} 分鐘
                    </ChakraText>
                  </Box>
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    {processedRouteData.legs.length} 個路段
                  </Badge>
                </Flex>

                <Divider />

                {processedRouteData.legs.map((leg, index) => (
                  <Accordion key={index} defaultIndex={[]} allowMultiple>
                    <AccordionItem>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <ChakraText fontWeight="bold">
                            {leg.startName}
                          </ChakraText>
                          <ChakraText fontSize="xs">
                            距離: {(leg.distance / 1000).toFixed(2)} 公里 /
                            時間: {(leg.duration / 60).toFixed(0)} 分鐘
                          </ChakraText>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel pb={4}>
                        <List>
                          <ListItem key={index}>
                            <List>
                              {leg.steps.map((step, stepIndex) => (
                                <ListItem key={stepIndex}>
                                  <Flex align="center">
                                    <ListIcon
                                      as={CornerUpRight}
                                      color="blue.500"
                                    />
                                    <ChakraText fontSize="sm">
                                      {step.name || "新路"}
                                      <ChakraText color="tomato">
                                        {step.drivingSide
                                          ? drivingSide(step.drivingSide)
                                          : ""}
                                      </ChakraText>
                                      - {step.distance.toFixed(0)}公尺 /{" "}
                                      {(step.duration / 60).toFixed(1)}分鐘
                                    </ChakraText>
                                  </Flex>
                                </ListItem>
                              ))}
                            </List>
                          </ListItem>
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}

                <Box>
                  <Heading size="md" pt={2}>
                    目的地：{" "}
                  </Heading>
                  <Divider />
                  <ChakraText fontSize="md" fontWeight="bold" ps={4} pt={2}>
                    {
                      processedRouteData.legs[
                        processedRouteData.legs.length - 1
                      ].endName
                    }
                  </ChakraText>
                </Box>
              </>
            ) : (
              <ChakraText>路線規劃</ChakraText>
            )}
          </Box>

          {/* 可以添加更多的Box組件來放置其他內容 */}
        </Flex>
        <Box
          position="absolute"
          zIndex={2}
          left="50%"
          top="40%"
          bg="#E2E8F0"
          borderRadius="xl"
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
          <Flex
            alignItems="Center"
            position="absolute"
            zIndex={2}
            bg="gray.100"
            h="40px"
            w="500px"
            left="20%"
            top={5}
            p={4}
          >
            <Box me={2}>
              <IconButton
                aria-label="Marker"
                icon={<MapPin color={isMarking ? "#f50000" : "currentColor"} />}
                onClick={toggleMarking}
              ></IconButton>
            </Box>
            <Box me={2}>
              {!route ? (
                <IconButton
                  aria-label="Route"
                  icon={<Route />}
                  onClick={calculateRoute}
                ></IconButton>
              ) : (
                <IconButton
                  aria-label="DeleteRoute"
                  icon={<Trash2 color="#ff0000" onClick={clearRoute} />}
                ></IconButton>
              )}
            </Box>
            <Box me={2}>
              <IconButton
                aria-label="Delete"
                icon={<CircleX color="#ff3333" />}
                onClick={clearAll}
              ></IconButton>
            </Box>
          </Flex>
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
