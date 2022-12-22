import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export default function SideBarScreen({ sideBar, categories }) {
  return (
    <div
      className={
        sideBar
          ? 'sidebar d-flex flex-column flex-wrap justify-content-between side-active'
          : 'sidebar d-flex flex-column flex-wrap justify-content-between'
      }
    >
      <Nav className="flex-column text-white w-100 p-2">
        <Nav.Item>
          <strong>Categories</strong>
        </Nav.Item>
        {categories.map((category) => (
          <Nav.Item key={category}>
            <Link to={`/search?ca${category}`}>{category}</Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}
