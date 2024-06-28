import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Stack,
  VStack,
  Heading,
  Input,
  Textarea,
  Button,
  ButtonGroup,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Text as ChakraText } from "@chakra-ui/react";

const MarkerDescription = ({ marker, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(marker.title || "");
  const [description, setDescription] = useState(marker.description || "");
  const [image, setImage] = useState(marker.image || "");

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ ...marker, title, description, image });
  };
  const handleDelete = () => {
    if (window.confirm("確定刪除這個標記嗎？")) {
      onDelete(marker.id);
    }
  };
  return (
    <Box bg="white" width="100%" p={4}>
      <Card maxW="md">
        <CardHeader>
          <Flex spacing="4">
            <Box>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="flushed"
                size="md"
              />
            </Box>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="See menu"
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述內容"
            size="md"
            variant="filled"
            rows={4}
          />
        </CardBody>
        <VStack
          spacing={4}
          align="stretch"
          bg="gray.100"
          p={4}
          m={4}
          borderRadius="md"
          cursor="pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {image ? (
            <Image objectFit="cover" src={image} alt="Uploaded Image" />
          ) : (
            <ChakraText textAlign="center">點擊上傳圖片</ChakraText>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            display="none"
          />
        </VStack>

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <Button flex="1" variant="ghost" onClick={handleSave}>
            Save
          </Button>
          <Button flex="1" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            flex="1"
            variant="ghost"
            colorScheme="red"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      {/* <VStack spacing={4} align="stretch">
        <Heading textAlign="center" as="h3" size="md">
          旅遊小卡
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
      </VStack> */}
    </Box>
  );
};

export default MarkerDescription;
