import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const GamesScreen = () => {
  const productList = useSelector((state) => state.productListAll);
  const { loading, error, products } = productList;

  const productsForDisplay = products.filter(
    (product) => product.category === "games"
  );

  return (
    <>
      <Meta />
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Всё для игр</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {productsForDisplay.map((product) => (
              <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default GamesScreen;