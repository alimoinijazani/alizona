import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import MessageBox from '../components/MessageBox';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function OrderScreen() {
  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    order: {},
    error: '',
    loading: true,
  });
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchData();
    }
  }, [userInfo, orderId, order, navigate]);

  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>address: </strong>
                {order.shippingAddress.address}
                <br />
              </Card.Text>
              <MessageBox variant={!order.isDelivered && 'danger'}>
                {order.isDelivered ? order.deliveredAt : 'Not Delivered'}
              </MessageBox>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {order.paymenMethod}
                <br />
              </Card.Text>
              <MessageBox variant={!order.isPaid && 'danger'}>
                {order.isPaid ? order.paidAt : 'Not Paid'}
              </MessageBox>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-item-center">
                      <Col md={6}>
                        <Link to={`/products/${item.slug}`}>
                          <img
                            className="img-thumbnail img-round"
                            src={item.image}
                            alt={item.slug}
                          />
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{order.itemPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>{order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>
                    <Row>
                      <Col>OrderTotal</Col>
                      <Col>{order.totalPrice}</Col>
                    </Row>
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
