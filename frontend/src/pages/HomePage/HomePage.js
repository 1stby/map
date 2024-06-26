import React from "react";
import Layout from "../../components/Layout/Layout";
import { Heading } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Layout>
      <Heading as="h1" size="2xl">
        Home Page
      </Heading>
    </Layout>
  );
};

export default HomePage;
