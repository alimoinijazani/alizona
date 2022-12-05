import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
import Container from 'react-bootstrap/Container';
import CartScreen from './screen/CartScreen';
export default function App() {
  return (
    <div className="site-container">
      <BrowserRouter>
        <NavScreen />
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
            </Routes>
          </Container>
        </main>
      </BrowserRouter>
      <footer className="footer">
        <div className="text-center">All Right Reserved</div>
      </footer>
    </div>
  );
}
