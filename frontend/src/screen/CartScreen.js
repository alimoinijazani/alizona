import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlusCircle, FaMinusCircle, FaTrashAlt } from 'react-icons/fa';
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.numInStock < quantity) {
      return window.alert('Not enough Product');
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  const removeCartHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <Row>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>ShoppingCart</h1>
      <Col md={8}>
        <Card>
          <ListGroup>
            {cart.cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={4}>
                    <Link to={`/product/${item.slug}`}>
                      <img
                        className="img-thumbnail "
                        src={item.image}
                        alt={item.slug}
                      />
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={3}>
                    <button
                      className="btn btn-light"
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <FaMinusCircle />
                    </button>
                    {item.quantity}
                    <button
                      className="btn btn-light"
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <FaPlusCircle />
                    </button>
                  </Col>
                  <Col md={3}>${item.price}</Col>
                  <Col md={2}>
                    <button
                      className="btn"
                      onClick={() => removeCartHandler(item)}
                    >
                      <FaTrashAlt />
                    </button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                SubTotal({cart.cartItems.length} items):$
                {cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid">
                <Button onClick={checkoutHandler}>Proceesd to Checkout</Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
