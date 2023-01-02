import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import NavScreen from './screen/NavScreen';
import Container from 'react-bootstrap/Container';
import CartScreen from './screen/CartScreen';
import ProductScreen from './screen/ProductScreen';
import SigninScreen from './screen/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingScreen from './screen/ShippingScreen';
import PaymentScreen from './screen/PaymentScreen';
import SignUpScreen from './screen/SignUpScreen';
import PlaceOrderScreen from './screen/PlaceOrderScreen';
import OrderScreen from './screen/OrderScreen';
import OrderHistoryScreen from './screen/OrderHistoryScreen';
import ProfileScreen from './screen/ProfileScreen';
import SideBarScreen from './screen/SideBarScreen';
import axios from 'axios';
import { getError } from './utils';
import SearchScreen from './screen/SearchScreen';
import AdminRoutes from './components/AdminRoutes';
import DashBoardScreen from './screen/DashBoardScreen';
import ProductListScreen from './screen/ProductListScreen';
import ProductEditScreen from './screen/ProductEditScreen';
import OrderListScreen from './screen/OrderListScreen';
import UserListScreen from './screen/UserListScreen';
import UserEditScreen from './screen/UserEditScreen';
import SupportScreen from './screen/SupportScreen';

import FooterScreen from './screen/FooterScreen';
import NotFoundScreen from './screen/NotFoundScreen';

export default function App() {
  const [sideBar, setSideBar] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/category');
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <div
        className={
          sideBar
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <NavScreen
          sideBar={sideBar}
          onSide={(sideBar) => setSideBar(!sideBar)}
        />
        <SideBarScreen sideBar={sideBar} categories={categories} />
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
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/search" element={<SearchScreen />} />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoutes>
                    <DashBoardScreen />{' '}
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoutes>
                    <ProductListScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoutes>
                    <ProductEditScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoutes>
                    <OrderListScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoutes>
                    <UserListScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <AdminRoutes>
                    <UserEditScreen />
                  </AdminRoutes>
                }
              />
              <Route
                path="/support"
                element={
                  <AdminRoutes>
                    <SupportScreen />
                  </AdminRoutes>
                }
              />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </Container>
        </main>
        <FooterScreen />
      </div>
    </BrowserRouter>
  );
}
