import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';

import axios from 'axios';
import { Store } from '../Store';

export default function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const addCartHandler = async (product) => {
    const existItems = state.cart.cartItems.find((p) => p._id === product._id);
    const quantity = existItems ? existItems.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry Not Enough Product');
    } else {
      ctxDispatch({ type: 'CART_ADD_ITEM', payload: [...product, quantity] });
    }
  };
  return (
    <Card>
      <Link to={`/products/:${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Card.Title>
          <Link to={`/products/:${product.slug}`}>{product.name}</Link>

          <Rating rating={product.rating} />

          <div>${product.price}</div>
        </Card.Title>
        {product.countInStock <= 0 ? (
          <Button variant="light" disabled>
            outOfStock
          </Button>
        ) : (
          <Button onClick={() => addCartHandler(product)}>Add To Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
