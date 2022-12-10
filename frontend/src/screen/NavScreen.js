import React, { useContext } from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
export default function NavScreen() {
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
      <NavBar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <NavBar.Brand>alizona</NavBar.Brand>
          </LinkContainer>

          <Nav className="me-auto w-100 justify-content-end align-items-center">
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
          </Nav>
        </Container>
      </NavBar>
    </header>
  );
}
