import Navbar from "../Navbar/Navbar";
import { Container, Flex, VStack, Box } from "@chakra-ui/react";
const Layout = ({ children }) => {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box flex={1}>
        <Container maxW="container.xl" pt={8}>
          <VStack spacing={8} align={"stretch"}>
            {children}
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default Layout;
