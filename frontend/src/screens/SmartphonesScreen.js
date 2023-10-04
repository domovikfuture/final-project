import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

import { listProductsAll } from "../actions/productActions";

const SmartphonesScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productListAll);
  const { loading, error, products } = productList;

  const productsForDisplay = products.filter(
    (product) => product.category === "smartphones"
  );

  useEffect(() => {
    dispatch(listProductsAll());
  }, [dispatch]);

  return (
    <>
      <Meta />
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Смартфоны и аксессуары
      </h1>
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

export default SmartphonesScreen;
