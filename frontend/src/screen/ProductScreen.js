import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Loading from './../components/Loading';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { Store } from '../Store';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export default function ProductScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });
  const params = useParams();
  const { slug } = params;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/product/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [slug]);
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((p) => p._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return window.alert('Not Enogh Product');
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox variant={'danger'}>{error}</MessageBox>
  ) : (
    <Row className="my-3">
      <Helmet>
        <title>{slug}</title>
      </Helmet>
      <Col md={6}>
        <img className="img-product" src={product.image} alt={product.slug} />
      </Col>
      <Col md={3}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h3>{product.name} </h3>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating rating={product.rating} />
          </ListGroup.Item>
          <ListGroup.Item>Price:{product.price}</ListGroup.Item>
          <ListGroup.Item>Description:{product.description}</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>Price:{product.price}</ListGroup.Item>
            <ListGroup.Item>
              Status:{' '}
              {product.conutInStock === 0 ? (
                <Badge pill bg="danger">
                  out of stock
                </Badge>
              ) : (
                <Badge pill bg="success">
                  in stock
                </Badge>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid">
                <Button onClick={() => addToCartHandler()}> Add To Cart</Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
