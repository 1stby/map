import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { MapPin, Route, Trash2, CircleX } from "lucide-react";

const ControlPanel = ({
  isMarking,
  toggleMarking,
  hasRoute,
  clearRoute,
  calculateRoute,
  clearAll,
}) => {
  return (
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
      <Tooltip label="新增標記" placement="bottom">
        <IconButton
          aria-label="新增標記"
          icon={<MapPin color={isMarking ? "#f50000" : "currentColor"} />}
          onClick={toggleMarking}
          me={2}
        />
      </Tooltip>
      <Tooltip label={hasRoute ? "清除路線" : "計算路線"} placement="bottom">
        <IconButton
          aria-label={hasRoute ? "清除路線" : "計算路線"}
          icon={hasRoute ? <Trash2 color="#ff0000" /> : <Route />}
          onClick={hasRoute ? clearRoute : calculateRoute}
          me={2}
        />
      </Tooltip>

      <Tooltip label="清除所有" placement="bottom">
        <IconButton
          aria-label="清除所有"
          icon={<CircleX color="#ff3333" />}
          onClick={clearAll}
        />
      </Tooltip>
    </Flex>
  );
};

export default ControlPanel;
