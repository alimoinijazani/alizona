import React from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
export default function NavScreen() {
  return (
    <header>
      <NavBar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <NavBar.Brand>alizona</NavBar.Brand>
          </LinkContainer>
        </Container>
      </NavBar>
    </header>
  );
}
