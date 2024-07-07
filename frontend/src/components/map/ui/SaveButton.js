import {
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Save } from "lucide-react";

const SaveButton = ({ saveData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = () => {
    saveData();
    onClose();
  };

  return (
    <>
      <Tooltip label="保存" placement="bottom">
        <IconButton aria-label="保存" icon={<Save />} onClick={onOpen} />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>保存數據</ModalHeader>
          <ModalCloseButton />
          <ModalBody>確定要保存當前的數據嗎？</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              保存
            </Button>
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SaveButton;
