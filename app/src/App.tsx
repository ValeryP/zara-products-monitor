import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainScreen from "./routes/MainScreen";

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="*" element={<MainScreen />} />
    </Routes>
  </BrowserRouter>;
}
