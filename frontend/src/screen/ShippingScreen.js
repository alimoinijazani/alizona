import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Input from '../components/Input';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
export default function ShippingScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart } = state;
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();

    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping</title>
      </Helmet>
      <Container className="small-container">
        <CheckoutSteps signin shipping />
        <h1>Shipping Address</h1>
        <Form onSubmit={handleSubmit}>
          <Input
            value={fullName}
            label="fullName"
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            value={city}
            label="City"
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            value={postalCode}
            label="PostalCode"
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <Input
            value={country}
            label="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
          {/* <Form.Group className="mb-3">
            <Form.Label>Fullname</Form.Label>
            <Form.Control
              value={fullName}
              placeholder="fullname"
              onChange={(e) => setFullName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              placeholder="address"
              onChange={(e) => setAddress(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PostalCode</Form.Label>
            <Form.Control
              value={postalCode}
              placeholder="PostalCode"
              onChange={(e) => setPostalCode(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
              required
            ></Form.Control>
          </Form.Group> */}
          <Button type="submit">Continue</Button>
        </Form>
      </Container>
    </div>
  );
}
