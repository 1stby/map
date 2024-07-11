import { Box, Button, Flex, Spacer, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg="gray.100">
      <Container maxW="container.xl">
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Box>Logo</Box>
          <Spacer />
          <Box lineHeight="3rem">
            <Link to="/">
              <Button colorScheme="blue" variant="ghost" mr={4}>
                Home
              </Button>
            </Link>
            <Link to="/plan">
              <Button colorScheme="blue" variant="ghost" mr={4}>
                規劃
              </Button>
            </Link>
            <Link to="/explore">
              <Button colorScheme="blue" variant="ghost" mr={4}>
                探索
              </Button>
            </Link>
            <Link to="/login">
              <Button colorScheme="blue" variant="ghost">
                Login
              </Button>
            </Link>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
