import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
export default function PaymentScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const navigate = useNavigate();
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || ''
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <Container className="small-container">
        <CheckoutSteps signin shipping payment />
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Check className="mb-3">
            <Form.Check.Label>Paypal</Form.Check.Label>
            <Form.Check.Input
              type="radio"
              value="paypal"
              checked={paymentMethodName === 'paypal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check.Input>
          </Form.Check>
          <Form.Check className="mb-3">
            <Form.Check.Label>Stripe</Form.Check.Label>
            <Form.Check.Input
              type="radio"
              value="stripe"
              checked={paymentMethodName === 'stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check.Input>
          </Form.Check>
          <Button type="submit">Continue</Button>
        </Form>
      </Container>
    </div>
  );
}
