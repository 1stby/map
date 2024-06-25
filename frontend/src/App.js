import router from "./router";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />;
    </ChakraProvider>
  );
};

export default App;
