import React, { useContext, useEffect, useReducer } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from './../Store';
import Loading from './../components/Loading';
import MessageBox from './../components/MessageBox';
import axios from 'axios';
import { getError } from './../utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        page: action.payload.page,
        pages: action.payload.pages,
        products: action.payload.products,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false, error: action.payload };
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
export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingDelete,
      successDelete,
      loadingCreate,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const order = sp.get('order') || '_id';
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/products/admin?page=${page}&order=${order}`,
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
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [order, page, successDelete, userInfo]);
  const createHandler = async () => {
    if (window.confirm('Are You Sure To Create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { authorization: `bearer ${userInfo.token}` },
          }
        );
        toast.success('Product Created Successfuly');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };
  const deleteHandler = async (product) => {
    if (window.confirm('Are You Sure To Delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/products/${product._id}`, {
          headers: { authorization: `bearer ${userInfo.token}` },
        });
        toast.success('product delete successfuly');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };
  const getFilterSort = (column) => {
    return `/admin/products?order=${column}`;
  };
  return (
    <div>
      <Row className="my-2">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createHandler}>Create Product</Button>
        </Col>
      </Row>
      {loadingCreate && <Loading />} {loadingDelete && <Loading />}
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>
                  {' '}
                  <Link
                    to={getFilterSort(order === 'price' ? '-price' : 'price')}
                  >
                    ID
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={getFilterSort(order === 'price' ? '-price' : 'price')}
                  >
                    NAME
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={getFilterSort(order === 'price' ? '-price' : 'price')}
                  >
                    PRICE
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={getFilterSort(order === 'price' ? '-price' : 'price')}
                  >
                    CATEGORY
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={getFilterSort(order === 'price' ? '-price' : 'price')}
                  >
                    BRAND
                  </Link>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      className="mx-1"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {[...Array(pages).keys()].map((x) => (
            <Link key={x + 1} to={`/admin/products?page=${x + 1}`}>
              <Button
                variant="light"
                className={Number(page) === x + 1 ? 'text-bold' : ''}
              >
                {x + 1}
              </Button>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
