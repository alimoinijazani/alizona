import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function OrderListScreen() {
  const [
    { loading, orders, error, pages, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const order = sp.get('order') || '_id';
  const page = sp.get('page') || 1;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/orders?page=${page}&order=${order}`,
          {
            headers: {
              authorization: `bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DeleteReset' });
    }
    fetchData();
  }, [order, page, successDelete, userInfo]);
  const getFilterSort = (filter) => {
    return `/admin/orders?order=${filter}`;
  };
  const deleteHandler = async (order) => {
    if (window.confirm('Are You Sure To Delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: {
            authorization: `bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        toast.error(getError(err));
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading || loadingDelete ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>
                  <Link to={getFilterSort(order === '_id' ? '-_id' : '_id')}>
                    ID
                  </Link>
                </th>
                <th>
                  <Link to={getFilterSort(order === 'user' ? '-user' : 'user')}>
                    USER
                  </Link>
                </th>
                <th>
                  <Link
                    to={getFilterSort(
                      order === 'createdAt' ? '-createdAt' : 'createdAt'
                    )}
                  >
                    DATE
                  </Link>
                </th>
                <th>
                  <Link
                    to={getFilterSort(
                      order === 'totalPrice' ? '-totalPrice' : 'totalPrice'
                    )}
                  >
                    TOTAL
                  </Link>
                </th>
                <th>
                  <Link
                    to={getFilterSort(
                      order === 'isPaid' ? '-isPaid' : 'isPaid'
                    )}
                  >
                    PAID
                  </Link>
                </th>
                <th>
                  <Link
                    to={getFilterSort(
                      order === 'isDelivered' ? '-isDelivered' : 'isDelivered'
                    )}
                  >
                    DELIVERED
                  </Link>
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name : 'Delete User'}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : 'No'}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="light"
                      className="mx-1"
                      onClick={() => deleteHandler(order)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      <Pagination>
        <Link to={`/admin/orders?page=1&order=${order}`} className="page-link">
          {'<<'}
        </Link>
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            className={
              x + 1 === Number(page) ? 'page-link active' : 'page-link'
            }
            to={`/admin/orders?page=${x + 1}&order=${order}`}
          >
            {x + 1}
          </Link>
        ))}
        <Link
          to={`/admin/orders?page=${pages}&order=${order}`}
          className="page-link"
        >
          {'>>'}
        </Link>
      </Pagination>
    </div>
  );
}
