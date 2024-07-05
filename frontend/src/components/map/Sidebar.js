import {
  Flex,
  Box,
  Heading,
  Badge,
  Divider,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";
import { Loader, CornerUpRight } from "lucide-react";
const Sidebar = ({ isLoading, route, processedRouteData }) => {
  if (isLoading) {
    return (
      <Flex align="center" p={4} bg="gray.100" m={4}>
        <Loader />
        <ChakraText ml={2}>路線計算中</ChakraText>
      </Flex>
    );
  }

  if (!route && !processedRouteData) {
    return null;
  }

  return (
    <Box bg="gray.100" m={4} p={4}>
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
            預計時間: {(processedRouteData.totalDuration / 60).toFixed(0)} 分鐘
          </ChakraText>
        </Box>
        <Badge colorScheme="green" p={2} borderRadius="md">
          {processedRouteData.legs.length} 個路段
        </Badge>
      </Flex>

      <VStack spacing={4} align="stretch" mt={2}>
        {processedRouteData.legs.map((leg, index) => (
          <Accordion key={index} defaultIndex={[]} allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <ChakraText fontWeight="bold">{leg.startName}</ChakraText>
                  <ChakraText fontSize="xs">
                    距離: {(leg.distance / 1000).toFixed(2)} 公里 / 時間:
                    {(leg.duration / 60).toFixed(0)} 分鐘
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
                            <ListIcon as={CornerUpRight} color="blue.500" />
                            <ChakraText fontSize="sm">
                              {step.name || "新路"}
                              <Box as="span" color="tomato">
                                {step.drivingSide}
                              </Box>
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
      </VStack>

      <Box>
        <Heading size="md" pt={2}>
          目的地：{" "}
        </Heading>
        <Divider />
        <ChakraText fontSize="md" fontWeight="bold" ps={4} pt={2}>
          {processedRouteData.legs[processedRouteData.legs.length - 1].endName}
        </ChakraText>
      </Box>
    </Box>
  );
};

export default Sidebar;
