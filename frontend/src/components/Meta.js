import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Добро пожаловать в МегаБазу ",
  description: "Мы продаем лучшие продукты по лучшим ценами",
  keywords: "Электроника",
};

export default Meta;
