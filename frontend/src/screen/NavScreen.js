import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaBars } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import SearchBox from '../components/SearchBox';
export default function NavScreen({ sideBar, onSide }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    window.location.href = '/signin';
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Button variant="dark" onClick={() => onSide(sideBar)}>
            <FaBars />
          </Button>
          <LinkContainer to="/">
            <Navbar.Brand>Alizona</Navbar.Brand>
          </LinkContainer>
          <SearchBox />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto w-100 justify-content-end align-items-center p-2">
              <Nav.Item>
                <Link to="/cart">
                  Cart
                  {cart.cartItems.length > 0 ? (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  ) : null}
                </Link>
              </Nav.Item>
              <Nav.Item>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderHistory">
                      <NavDropdown.Item>orderHistory</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider></NavDropdown.Divider>
                    <LinkContainer to="" onClick={signoutHandler}>
                      <NavDropdown.Item>Signout</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : (
                  <Link to="/signin" className="nav-link">
                    Signin
                  </Link>
                )}
              </Nav.Item>
              <Nav.Item>
                {userInfo.isAdmin ? (
                  <NavDropdown title="admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : null}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
