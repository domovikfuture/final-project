import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  let ratingText;
  switch (product.numReviews) {
    case 1:
      ratingText = "отзыв";
      break;

    case 2:
      ratingText = "отзыва";
      break;

    case 3:
      ratingText = "отзыва";
      break;

    case 4:
      ratingText = "отзыва";
      break;

    default:
      ratingText = "отзывов";
  }
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.productId}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.productId}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} ${ratingText}`}
          />
        </Card.Text>

        <Card.Text as="h3">{product.price} BYN</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
