import { createBrowserRouter } from "react-router-dom";
import React from "react";

import Home from "../pages/HomePage/HomePage";
import Login from "../pages/login/Login";
import Explore from "../pages/explore/Explore";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
