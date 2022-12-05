import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Rating from './Rating';

export default function Product({ product }) {
  const navigate = useNavigate();
  const addCartHandler = (product) => {
    navigate('/cart');
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
