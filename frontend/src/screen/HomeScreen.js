import React, { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Product from '../components/product';
import Loading from './../components/Loading';
import MessageBox from './../components/MessageBox';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant={'danger'}>{error}</MessageBox>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.slug} md={4} lg={3} sm={8} className="my-2">
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
