import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Menu } from "antd";
import SatoriEdtoriReview from "./components/SatoriEdtoriReview";
import DAST from "./components/DAST";
import CommonTool from "./components/CommonTool";
import FactCarousel from "./components/FactCarousel"
import LotteryRandomChecker from "./components/LotteryRandomChecker"
import NotepadCompare from "./components/NotepadCompare"
import AlDetect from "./components/AlDetect"

export default function App() {
  // ⬇️ 将 Excel 数据状态提升到这里
  const [tableData, setTableData] = useState([]);

  return (
    <Router>
      {/* 顶部菜单 */}
      <Menu mode="horizontal" theme="light">
        <Menu.Item key="satoriEdtoriReview">
          <Link to="/satoriEdtoriReview">Edtori Review</Link>
        </Menu.Item>
        <Menu.Item key="CommonTool">
          <Link to="/CommonTool">常用工具</Link>
        </Menu.Item>
        <Menu.Item key="DAST">
          <Link to="/DAST">DAST</Link>
        </Menu.Item>
        <Menu.Item key="FactCarousel">
          <Link to="/FactCarousel">FactCarousel</Link>
        </Menu.Item>
        <Menu.Item key="NotepadCompare">
          <Link to="/NotepadCompare">比较器</Link>
        </Menu.Item>
        {/* <Menu.Item key="LotteryRandomChecker">
          <Link to="/LotteryRandomChecker">比较</Link>
        </Menu.Item> */}
        <Menu.Item key="AlDetect">
          <Link to="/AlDetect">AlDetect</Link>
        </Menu.Item>
      </Menu>



      {/* 路由配置 */}
      <Routes>
        <Route
          path="/satoriEdtoriReview"
          element={
            <SatoriEdtoriReview
              tableData={tableData}
              setTableData={setTableData}
            />
          }
        />
        <Route
          path="/CommonTool"
          element={<CommonTool />}
        />
        <Route
          path="/DAST"
          element={<DAST />}
        />
        <Route
          path="/FactCarousel"
          element={<FactCarousel />}
        />
        <Route
          path="/LotteryRandomChecker"
          element={<LotteryRandomChecker />}
        />
        <Route
          path="/NotepadCompare"
          element={<NotepadCompare />}
        />
        <Route
          path="/AlDetect"
          element={<AlDetect/>}
        />
      </Routes>

    </Router>
  );
}
