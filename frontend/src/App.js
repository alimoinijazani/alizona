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
import PaymentScreen from './screen/PaymentScreen';
import SignUpScreen from './screen/SignUpScreen';
import PlaceOrderScreen from './screen/PlaceOrderScreen';
import OrderScreen from './screen/OrderScreen';
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
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
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
