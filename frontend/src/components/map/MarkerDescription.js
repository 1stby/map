import React, { useState } from "react";
import { Box, Flex, Heading, Input, Textarea, Button } from "@chakra-ui/react";

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
    <Flex flexDirection="column" justifyContent="center" p={4}>
      <Heading textAlign="center" mb={2}>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="flushed"
          placeholder="標題"
        />
      </Heading>

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述內容"
      />
      <Flex justifyContent="center" mt={4}>
        <Button flex={1} me={2} onClick={handleSave}>
          保存
        </Button>
        <Button flex={1} onClick={onCancel}>
          取消
        </Button>
      </Flex>

      <Button mt={2} colorScheme="red" onClick={handleDelete}>
        刪除標記
      </Button>
    </Flex>
  );
};

export default MarkerDescription;
