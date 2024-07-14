import { useEffect, useState } from "react";
import { convertToCoord } from "../../services/geoService";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  Text,
  Box,
  Select,
} from "@chakra-ui/react";

import usePlanStore from "../../store/PlanStore";

const PlanSelector = ({ isOpen, onClose, onCoordsUpdate }) => {
  const { plans } = usePlanStore();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [locations, setLocations] = useState([]);
  const [coord, setCoord] = useState([]);

  const handlePlanChange = (e) => {
    const selectedPlanId = e.target.value;
    setSelectedPlan(selectedPlanId);
  };

  const updataCoords = async (planId) => {
    if (!planId) return;
    const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

    if (selectedPlanData) {
      const locationNames = selectedPlanData.locations.map(
        (location) => location.locationName
      );
      setLocations(locationNames);
      const allCoords = await Promise.all(
        locationNames.map(async (locationName) => {
          try {
            return await convertToCoord(locationName);
          } catch (err) {
            console.error(`無法轉換位置: ${locationName}`, err);
          }
        })
      );

      setCoord(allCoords);
    }
  };

  useEffect(() => {
    if (plans.length > 0) {
      const firstPlanId = plans[0].id;
      setSelectedPlan(firstPlanId);
      updataCoords(firstPlanId);
    }
  }, [plans]);

  useEffect(() => {
    if (selectedPlan) {
      updataCoords(selectedPlan);
    }
  }, [selectedPlan]);

  useEffect(() => {
    console.log("選擇的景點", locations);
  }, [locations]);

  useEffect(() => {
    console.log("所有座標：", coord);
  }, [coord]);

  const handleConfirm = () => {
    onClose();
    onCoordsUpdate(coord);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選擇你的計畫</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Select onChange={handlePlanChange}>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </Select>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
              確認
            </Button>
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlanSelector;
