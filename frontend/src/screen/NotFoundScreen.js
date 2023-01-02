import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export default function NotFoundScreen() {
  return (
    <div>
      <Container>
        <h1>NOT FOUND PAGE</h1>
        <h3>
          GO BACK TO{' '}
          <Link to="/" className="link-info">
            HOME
          </Link>
        </h3>
      </Container>
    </div>
  );
}
