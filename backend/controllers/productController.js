import asyncHandler from "express-async-handler";

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const { count, products } = await req.db.fetchProducts(
    keyword,
    pageSize,
    page
  );

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const products = await req.db.fetchAllProducts(keyword);

  res.json({ products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await req.db.fetchProductById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
  }
});

const deleteProduct = asyncHandler(async (req, res, db) => {
  const isDeleted = await req.db.removeProduct(req.params.id);

  if (isDeleted) {
    res.json({ message: "Товар удален" });
  } else {
    res.status(404);
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const createdProduct = await req.db.createNewProduct(req.body, req.user._id);
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const { product, isUpdated } = await req.db.updateCreatedProduct(
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    req.params.id
  );

  if (isUpdated) {
    res.json(product);
  } else {
    res.status(404);
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const { isSuccess } = await req.db.leaveProductReview(
    req.params.id,
    req.user._id.toString(),
    req.user.name,
    Number(rating),
    comment
  );

  if (isSuccess) {
    res.status(201).json({ message: "Отзыв добавлен" });
  } else {
    res.status(404);
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await req.db.fetchTopProducts(-1, 3);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getAllProducts,
};
