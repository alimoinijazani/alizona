import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaSearch } from 'react-icons/fa';
export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Product..."
          aria-label="Search"
          aria-describedby="button-search"
        ></Form.Control>
        <Button type="submit" id="button-search">
          <FaSearch />
        </Button>
      </InputGroup>
    </form>
  );
}
