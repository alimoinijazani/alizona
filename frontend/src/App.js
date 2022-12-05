import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavScreen />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
