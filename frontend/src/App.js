import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
import Container from 'react-bootstrap/Container';
import CartScreen from './screen/CartScreen';
import ProductScreen from './screen/ProductScreen';
export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <NavScreen />
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
            </Routes>
          </Container>
        </main>
        <footer className="footer">
          <div className="text-center">All Right Reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
