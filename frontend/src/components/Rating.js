import React from 'react';
import { FaStarHalf, FaStar } from 'react-icons/fa';
export default function Rating({ rating, caption }) {
  const oneStars = Math.floor(rating);
  const stars = [...Array(oneStars).keys()];
  console.log();
  return (
    <div className="rating">
      {rating}{' '}
      {stars.map((star) => (
        <span key={star}>
          <FaStar />
        </span>
      ))}
      {rating > oneStars ? (
        <span>
          <FaStarHalf />
        </span>
      ) : null}
    </div>
  );
}
