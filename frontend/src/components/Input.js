import React from 'react';
import Form from 'react-bootstrap/Form';
export default function Input({ value, label, onChange, type = 'text' }) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className="mb-3"
        type={type}
        value={value}
        required
        placeholder={label}
        onChange={(e) => onChange(e)}
      ></Form.Control>
    </Form.Group>
  );
}
