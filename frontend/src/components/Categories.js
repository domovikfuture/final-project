import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
import "../styles/categories.css";

const Categories = () => {
  return (
    <header>
      <Nav className="ml-auto navigation">
        <LinkContainer to="/tv">
          <Nav.Link>Телевизоры и аудиотехника</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/smartphones">
          <Nav.Link>Смартфоны и аксессуары</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/games">
          <Nav.Link>Всё для игр</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/notebooks">
          <Nav.Link>Ноутбуки и аксессуары</Nav.Link>
        </LinkContainer>
      </Nav>
    </header>
  );
};

export default Categories;
