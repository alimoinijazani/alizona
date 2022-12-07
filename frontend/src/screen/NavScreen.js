import React, { useContext } from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
export default function NavScreen() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <header>
      <NavBar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <NavBar.Brand>alizona</NavBar.Brand>
          </LinkContainer>

          <Nav className="ms-auto">
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
          </Nav>
        </Container>
      </NavBar>
    </header>
  );
}
