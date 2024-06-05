import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        <li>
          <Link to="/">首頁</Link>
        </li>
        <li>
          <Link to="/map">地圖</Link>
        </li>
        <li>
          <Link to="/login">登入</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
