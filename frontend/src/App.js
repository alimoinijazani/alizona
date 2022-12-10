import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
import Container from 'react-bootstrap/Container';
import CartScreen from './screen/CartScreen';
import ProductScreen from './screen/ProductScreen';
import SigninScreen from './screen/SigninScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingScreen from './screen/ShippingScreen';
export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <div className="d-flex flex-column site-container">
        <NavScreen />
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
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
