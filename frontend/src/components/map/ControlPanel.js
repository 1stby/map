import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { MapPin, Route, Trash2, CircleX } from "lucide-react";
import SaveButton from "./ui/SaveButton";

const ControlPanel = ({
  isMarking,
  toggleMarking,
  hasRoute,
  clearRoute,
  calculateRoute,
  clearAll,
  saveData,
}) => {
  return (
    <Flex
      alignItems="center"
      position="absolute"
      zIndex={2}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      h="50px"
      left="50%"
      transform="translateX(-50%)"
      top={5}
      p={2}
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

      <Tooltip label="清除" placement="bottom">
        <IconButton
          aria-label="清除"
          icon={<CircleX color="#ff3333" />}
          onClick={clearAll}
          me={2}
        />
      </Tooltip>
      <SaveButton saveData={saveData} />
    </Flex>
  );
};

export default ControlPanel;
