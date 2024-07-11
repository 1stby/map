import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Heading,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  VStack,
  FormLabel,
  FormControl,
  Input,
  IconButton,
  Button,
  Flex,
  List,
  ListItem,
  ListIcon,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { MapPin, Clock, X } from "lucide-react";

const initialActivityState = {
  name: "",
  locations: [],
  cost: "",
  notes: "",
  category: "",
};

const TravelPlanner = () => {
  const [activities, setActivities] = useState([initialActivityState]);

  const [currentLocation, setCurrentLocation] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const handleAddLocation = () => {
    if (currentLocation.trim() !== "") {
      setActivities((prevActivities) => [
        {
          ...prevActivities[0],
          locations: [
            ...prevActivities[0].locations,
            {
              id: uuidv4(),
              name: currentLocation,
              time: currentTime,
            },
          ],
        },
      ]);
      setCurrentLocation("");
      setCurrentTime("");
    }
  };

  const handleDeleteLocation = (id) => {
    setActivities((prevActivities) => {
      const currentActivity = prevActivities[0];
      const updatedLocations = currentActivity.locations.filter(
        (location) => location.id !== id
      );
      return [
        {
          ...currentActivity,
          locations: updatedLocations,
        },
      ];
    });
  };

  return (
    <Box>
      <Heading mb={4} textAlign="center">
        旅行規劃
      </Heading>
      <Box boxShadow="xl" p="6" rounded="md" bg="white">
        <Tabs>
          <TabList>
            <Tab>第一天</Tab>
            <Tab>第二天</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>活動名稱</FormLabel>
                  <Input />
                </FormControl>

                <Flex gap={4}>
                  <Box flex={1}>
                    <VStack spacing={4} align="stretch">
                      <FormControl mb={4}>
                        <FormLabel>時間</FormLabel>
                        <Input
                          type="time"
                          value={currentTime}
                          onChange={(e) => setCurrentTime(e.target.value)}
                        />
                      </FormControl>
                      <FormControl mb={4}>
                        <FormLabel>地點</FormLabel>
                        <Input
                          value={currentLocation}
                          onChange={(e) => setCurrentLocation(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        onClick={handleAddLocation}
                        isDisabled={!currentLocation}
                      >
                        添加景點
                      </Button>
                    </VStack>
                  </Box>

                  <Box flex={1}>
                    <FormLabel>已添加地點：</FormLabel>
                    <List spacing={3}>
                      {activities[0].locations.map((location) => (
                        <ListItem
                          key={location.id}
                          display="flex"
                          alignItems="center"
                        >
                          <ListIcon as={MapPin} color="green.500" />
                          <Text me={4}>{location.name}</Text>
                          {location.time && (
                            <>
                              <ListIcon as={Clock} color="blue.500" ml={2} />
                              {location.time}
                            </>
                          )}
                          <IconButton
                            ml="auto"
                            icon={<X color="#f42a2a" />}
                            bg="transparent"
                            onClick={() => {
                              handleDeleteLocation(location.id);
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Flex>

                <FormControl>
                  <FormLabel>花費</FormLabel>
                  <Input />
                </FormControl>

                <FormControl>
                  <FormLabel>評分</FormLabel>
                  <Input />
                </FormControl>

                <FormControl>
                  <FormLabel>筆記</FormLabel>
                  <Textarea />
                </FormControl>

                <FormControl>
                  <FormLabel>分類</FormLabel>
                  <Input />
                </FormControl>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default TravelPlanner;
