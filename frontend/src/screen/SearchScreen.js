import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from './../components/Rating';
import Loading from './../components/Loading';
import MessageBox from './../components/MessageBox';
import { FaTimesCircle } from 'react-icons/fa';
import Product from '../components/product';
import { toast } from 'react-toastify';
import { getError } from './../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        countProducts: action.payload.countProducts,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ratings = [4, 3, 2, 1];

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $100', value: '201-1000' },
];
export default function SearchScreen() {
  const [{ loading, products, error, countProducts, pages }, dispatch] =
    useReducer(reducer, { loading: true, error: '', products: [] });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const query = sp.get('query') || 'all';
  const category = sp.get('category') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || '1';
  const [categories, setCategories] = useState([]);
  const getFilterUrl = (filter) => {
    const filterQuery = filter.query || query;
    const filterCategory = filter.category || category;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const filterOrder = filter.order || order;
    const filterPage = filter.page || page;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/products/search?category=${category}&query=${query}&page=${page}&order=${order}&price=${price}&rating=${rating}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL' });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);
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
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <div>
            <h3>Department</h3>
            <ul>
              <li>
                <Link
                  to={getFilterUrl({ category: 'all' })}
                  className={category === 'all' ? 'text-bold' : ''}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to={getFilterUrl({ category: c })}
                    className={category === c ? 'text-bold' : ''}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  to={getFilterUrl({ price: 'all' })}
                  className={price === 'all' ? 'text-bold' : ''}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.name}>
                  <Link to={getFilterUrl({ price: p.value })}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg.Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r}>
                  <Link to={getFilterUrl({ rating: r })}>
                    <Rating rating={r} caption={' & up'}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 0 })}
                  className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating rating={0} caption={' & up'} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>

        <Col md={9}>
          {loading ? (
            <Loading />
          ) : error ? (
            <MessageBox variant="alert">{error}</MessageBox>
          ) : (
            <Row className="justify-content-between">
              <Col md={6}>
                {countProducts === 0 ? 'No' : countProducts} Result :
                {query !== 'all' ? query : null}:
                {category !== 'all' ? `Department: ${category}` : null}:
                {price !== 'all' ? `Price: ${price}` : null}:
                {rating !== 'all' ? `Rating: ${rating} &up` : null}
                {query !== 'all' ||
                  category !== 'all' ||
                  price !== 'all' ||
                  (rating !== 'all' ? (
                    <Button variant="light" onClick={() => navigate('/search')}>
                      <FaTimesCircle />
                    </Button>
                  ) : null)}
              </Col>

              <Col className="text-end">
                Sort By{' '}
                <select
                  value={order}
                  onChange={(e) =>
                    navigate(getFilterUrl({ order: e.target.value }))
                  }
                >
                  <option value="newest">Newest Arrive</option>
                  <option value="lowest">Price: Low To High </option>
                  <option value="highest">Price: High To Low</option>
                  <option value="toprated">Avg.Customer Reviews</option>
                </select>
              </Col>
              {products.length === 0 && (
                <MessageBox variant="danger">No Products Found</MessageBox>
              )}
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={6} lg={4} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              {[...Array(pages).keys()].map((x) => (
                <Link key={x} to={getFilterUrl({ page: x + 1 })}>
                  <Button
                    variant="light"
                    className={Number(page) === x + 1 ? 'text-bold' : ''}
                  >
                    {x + 1}
                  </Button>
                </Link>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}
