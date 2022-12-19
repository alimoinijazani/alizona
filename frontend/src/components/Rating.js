import React from 'react';
import { FaStarHalf, FaStar, FaRegStar } from 'react-icons/fa';
export default function Rating({ rating, caption }) {
  const oneStars = Math.floor(rating);
  const stars = [...Array(oneStars).keys()];

  return (
    <div className="rating">
      {rating}{' '}
      {stars
        ? stars.map((star) => (
            <span key={star}>
              <FaStar />
            </span>
          ))
        : null}
      {rating > oneStars ? (
        <span>
          <FaStarHalf />
        </span>
      ) : null}
      {[...Array(5 - Math.ceil(rating)).keys()].map((star) => (
        <span key={star}>
          <FaRegStar />
        </span>
      ))}
      {caption && <span>{caption}</span>}
    </div>
  );
}
