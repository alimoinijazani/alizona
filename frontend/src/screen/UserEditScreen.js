import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function UserEditScreen() {
  const { params: userId } = useParams();
  return (
    <div>
      <Helmet>
        <title>{userId}</title>
      </Helmet>
      <h1>{userId}</h1>
    </div>
  );
}
