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
} from "@chakra-ui/react";
import { useState } from "react";

const MapModal = ({ isOpen, onClose, onLocationSubmit }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await response.json();

      if (data) {
        const { lat, lon } = data[0];
        onLocationSubmit(parseFloat(lat), parseFloat(lon));
        onClose();
      } else {
        alert("無法找到該地點，請重試。");
      }
    } catch (err) {
      console.log("Error Location:", err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>輸入想去的地方</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="輸入地點"
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" me={2}>
                出發
              </Button>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                取消
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MapModal;
