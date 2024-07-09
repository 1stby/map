import { Box, Input, IconButton, useDisclosure, Flex } from "@chakra-ui/react";
import { ScanSearch } from "lucide-react";
import { useState } from "react";

const SearchLocation = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          inputValue
        )}`
      );
      const data = await response.json();

      if (data) {
        const { lat, lon } = data[0];
        onSearch(parseFloat(lat), parseFloat(lon));
        setInputValue("");
        onToggle();
      } else {
        alert("無法找到該地點，請重試。");
      }
    } catch (err) {
      console.log("Error Location:", err);
    }
  };
  return (
    <Box width="200px">
      <form onSubmit={handleSubmit}>
        <Flex>
          <IconButton
            type="submit"
            aria-label="Search"
            icon={<ScanSearch />}
            bg="white"
            size="0.5rem"
            onClick={onToggle}
          />
          <Input
            display={isOpen ? "block" : "none"}
            size="0.5rem"
            bg="white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Flex>
      </form>
    </Box>
  );
};

export default SearchLocation;
