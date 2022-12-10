import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function CheckoutSteps({
  signin,
  shipping,
  payment,
  placeOrder,
}) {
  const checkoutClass = (step) => {
    return step ? 'checkout-active' : 'checkout';
  };
  return (
    <Row>
      <Col md={3} className={checkoutClass(signin)}>
        Signin
      </Col>
      <Col md={3} className={checkoutClass(shipping)}>
        ShippingAddress
      </Col>
      <Col md={3} className={checkoutClass(payment)}>
        Payment
      </Col>
      <Col md={3} className={checkoutClass(placeOrder)}>
        PlaceOrder
      </Col>
    </Row>
  );
}
