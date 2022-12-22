import React, { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Store } from './../Store';
import Loading from './../components/Loading';
import MessageBox from './../components/MessageBox';
import axios from 'axios';
import { getError } from './../utils';
import Chart from 'react-google-charts';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashBoardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders/summary', {
          headers: {
            authorization: `bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_REQUEST', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>DashBoardScreen</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUser
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrder
                      : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSale
                      : 0}
                  </Card.Title>
                  <Card.Text>Total Sale</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="mx-3">
            <h1>Sales</h1>
            <Chart
              width="100%"
              height="400px"
              chartType="AreaChart"
              loader={<div>loading chart...</div>}
              data={[
                ['Date', 'Sales'],
                ...summary.dailyOrders.map((x) => [x._id, x.sales]),
              ]}
            ></Chart>
            <Chart
              width="100%"
              height="400px"
              chartType="PieChart"
              loader={<div>loading chart...</div>}
              data={[
                ['Category', 'Products'],
                ...summary.productCategories.map((x) => [x._id, x.count]),
              ]}
            ></Chart>
          </div>
        </>
      )}
    </div>
  );
}
