import { createBrowserRouter } from "react-router-dom";
import React from "react";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Map from "../pages/map/Map";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
