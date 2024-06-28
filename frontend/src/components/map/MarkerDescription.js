import React, { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Input,
  Textarea,
  Button,
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";

const MarkerDescription = ({ marker, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(marker.title || "");
  const [description, setDescription] = useState(marker.description || "");

  const handleSave = () => {
    onSave({ ...marker, title, description });
  };
  const handleDelete = () => {
    if (window.confirm("確定刪除這個標記嗎？")) {
      onDelete(marker.id);
    }
  };
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      maxWidth="400px"
      width="100%"
      borderWidth={1}
      borderColor="gray.200"
      p={2}
    >
      <VStack spacing={4} align="stretch">
        <Heading textAlign="center" as="h3" size="md">
          編輯標記
        </Heading>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="flushed"
          size="md"
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述內容"
          size="md"
          variant="filled"
          rows={4}
        />
        <ButtonGroup spacing={3} width="100%">
          <Button colorScheme="blue" onClick={handleSave} flex={1}>
            保存
          </Button>
          <Button variant="outline" onClick={onCancel} flex={1}>
            取消
          </Button>
        </ButtonGroup>

        <Divider />

        <Button colorScheme="red" onClick={handleDelete} width="100%">
          刪除標記
        </Button>
      </VStack>
    </Box>
  );
};

export default MarkerDescription;
