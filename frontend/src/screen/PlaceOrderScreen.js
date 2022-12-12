import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import Loading from './../components/Loading';
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrderScreen() {
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const { paymentMethod } = cart;
  const navigate = useNavigate();
  const round2 = (n) => Math.round(n * 100 + Number.EPSILON) / 100;
  cart.itemPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemPrice > 100 ? round2(10) : round2(0);
  cart.taxPrice = round2(cart.itemPrice * 0.1);
  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;
  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        'api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemPrice: cart.itemPrice,
          taxPrice: cart.taxPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        { headers: { authorization: `bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <CheckoutSteps signin shipping payment placeOrder />
      <h1>Order Review</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <div>
                <strong>Name:</strong>
                {cart.shippingAddress.fullName}
              </div>
              <div>
                <strong>address:</strong> {cart.shippingAddress.address}
              </div>
              <Link to="/shipping" className="link-primary">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <div>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </div>

              <Link to="/payment" className="link-primary">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>

              {cart.cartItems.map((item) => (
                <Row key={item._id} className="align-item-center">
                  <Col md={6}>
                    <Link to={`/product/${item.slug}`}>
                      <img
                        src={item.image}
                        alt={item.slug}
                        className="img-fluid img-thumbnail"
                      />
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={3}>{item.quantity}</Col>
                  <Col md={3}>{item.price}</Col>
                </Row>
              ))}

              <Link to="/cart" className="link-primary">
                Edit
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>items:</Col> <Col>{cart.itemPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>shipping:</Col> <Col>{cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>tax:</Col> <Col>{cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>
                    <Row>
                      <Col>orderTotals:</Col> <Col>{cart.toalPrice}</Col>
                    </Row>
                  </strong>
                </ListGroup.Item>
              </ListGroup>
              <div className="d-grid">
                <Button
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0}
                >
                  Place Order
                </Button>
                {loading && <Loading />}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
