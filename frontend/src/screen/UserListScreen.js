import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Table from 'react-bootstrap/Table';

import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import MessageBox from '../components/MessageBox';
import Loading from '../components/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const [{ loading, users, pages, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const order = sp.get('order') || '_id';
  const page = sp.get('page') || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/users/admin?page=${page}&order=${order}`,
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
    fetchData();
  }, [order, page, userInfo]);

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
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
                  <Link
                    to={`/admin/users?order=${
                      order === '_id' ? '-_id' : '_id'
                    }`}
                  >
                    ID
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={`/admin/users?order=${
                      order === 'name' ? '-name' : 'name'
                    }`}
                  >
                    Name
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={`/admin/users?order=${
                      order === 'email' ? '-email' : 'email'
                    }`}
                  >
                    EMAIL
                  </Link>
                </th>
                <th>
                  {' '}
                  <Link
                    to={`/admin/users?order=${
                      order === 'isAdmin' ? '-isAdmin' : 'isAdmin'
                    }`}
                  >
                    IS ADMIN
                  </Link>
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Link
              to={`/admin/users?page=${1}&order=${order}`}
              className="page-link"
            >
              {'<<'}
            </Link>
            <Link
              to={`/admin/users?page=${Number(page) - 1}&order=${order}`}
              className="page-link"
            >
              {'<'}
            </Link>
            {[...Array(pages).keys()].map((x) => (
              <Link
                key={x + 1}
                to={`/admin/users?page=${x + 1}`}
                className={
                  Number(page) === x + 1 ? 'page-link active' : 'page-link'
                }
              >
                {x + 1}
              </Link>
            ))}
            <Link
              to={`/admin/users?page=${Number(page) + 1}&order=${order}`}
              className="page-link"
            >
              {'>'}
            </Link>
            <Link
              to={`/admin/users?page=${pages}&order=${order}`}
              className="page-link"
            >
              {'>>'}
            </Link>
          </Pagination>
        </>
      )}
    </div>
  );
}
