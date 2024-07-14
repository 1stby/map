import { useState } from "react";
import usePlanStore from "../../store/PlanStore";

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

const TravelPlan = () => {
  const {
    currentPlan,
    updateCurrentPlan,
    addLocation,
    rmLocation,
    savePlan,
    plans,
  } = usePlanStore();

  const [newLocation, setNewLocation] = useState({
    locationName: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateCurrentPlan({ [name]: value });
  };

  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLocation = () => {
    if (newLocation.locationName.trim() !== "") {
      addLocation(newLocation);
      setNewLocation({ locationName: "", time: "" });
    }
  };

  const handleDeleteLocation = (id) => {
    rmLocation(id);
  };

  const handleSavePlan = () => {
    savePlan();
    // console.log("All plans after saving:", plans);
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
                  <Input
                    name="name"
                    value={currentPlan.name}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Flex gap={4}>
                  <Box flex={1}>
                    <VStack spacing={4} align="stretch">
                      <FormControl mb={4}>
                        <FormLabel>時間</FormLabel>
                        <Input
                          type="time"
                          name="time"
                          value={newLocation.time}
                          onChange={handleLocationInputChange}
                        />
                      </FormControl>
                      <FormControl mb={4}>
                        <FormLabel>地點</FormLabel>
                        <Input
                          name="locationName"
                          value={newLocation.locationName}
                          onChange={handleLocationInputChange}
                        />
                      </FormControl>
                      <Button
                        onClick={handleAddLocation}
                        isDisabled={!newLocation.locationName}
                      >
                        添加景點
                      </Button>
                    </VStack>
                  </Box>

                  <Box flex={1}>
                    <FormLabel>已添加地點：</FormLabel>
                    <List spacing={3}>
                      {currentPlan.locations.map((location) => (
                        <ListItem
                          key={location.id}
                          display="flex"
                          alignItems="center"
                        >
                          <ListIcon as={MapPin} color="green.500" />
                          <Text me={4}>{location.locationName}</Text>
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
                  <Input
                    name="cost"
                    value={currentPlan.cost}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>評分</FormLabel>
                  <Input />
                </FormControl>

                <FormControl>
                  <FormLabel>筆記</FormLabel>
                  <Textarea
                    name="notes"
                    value={currentPlan.notes}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>分類</FormLabel>
                  <Input
                    name="category"
                    value={currentPlan.category}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button colorScheme="blue" onClick={handleSavePlan}>
                  保存計劃
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default TravelPlan;
