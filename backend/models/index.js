import Product from "./productModel.js";
import NotFound from "./notFoundPageModel.js";
import mongoose from "mongoose";

class MongoDBDataAccessLayer {
  constructor() {
    this.connection;
  }
  connect() {
    const url =
      "mongodb+srv://domovikfuture:06102021FLS@cluster0.xtnme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    try {
      mongoose.connect(url);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
    const dbConnection = mongoose.connection;
    this.connection = dbConnection;
    dbConnection.once("open", (_) => {
      console.log(`База данных подключена: ${url}`);
    });

    dbConnection.on("error", (err) => {
      console.error(`Ошибка подключения: ${err}`);
    });
    return dbConnection;
  }

  disconnect() {
    console.log(`Подключение к БД закрыто.`);
    this.connection.close();
  }

  async fetchProducts(keyword, pageSize, page) {
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    return { count, products };
  }

  async fetchAllProducts(keyword) {
    const products = await Product.find({ ...keyword });
    return products;
  }

  async fetchProductById(id) {
    const product = await Product.findOne({productId: id});
    return product;
  }

  async removeProduct(id) {
    const product = await Product.findOne({productId: id});
    console.log(product)
    if (product) {
      await product.deleteOne();
    }
    return !!product;
  }

  async createNewProduct(productInfo, userId) {
    const product = await Product({
      name: productInfo.name,
      price: productInfo.price,
      user: userId,
      image: productInfo.image || "/images/sample.jpg",
      brand: productInfo.brand,
      category: productInfo.category,
      countInStock: productInfo.countInStock,
      numReviews: 0,
      description: productInfo.description,
      productId: productInfo._id,
    });

    const createdProduct = await product.save();
    return createdProduct;
  }

  async updateCreatedProduct(
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    id
  ) {
    const product = await Product.findOne({productId: id});
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      return { product: updatedProduct, isUpdated: true };
    } else {
      return { product: null, isUpdated: false };
    }
  }

  async leaveProductReview(id, userId, userName, rating, text) {
    const product = await Product.findOne({productId: id});

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId
      );
      if (alreadyReviewed) {
        return { isSuccess: false };
      }
      const review = {
        name: userName,
        rating: rating,
        comment: text,
        user: userId,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      return {isSuccess: true}
    } else {
      return { isSuccess: false };
    }
  }

  async fetchTopProducts(rating, limit) {
    const products = await Product.find({})
      .sort({ rating: rating })
      .limit(limit);
    return products;
  }

  async fetch404PageHtml(text) {
    await NotFound.deleteMany({});
    await NotFound.create({
      text: text,
    });
  }

  async get404PageHtml() {
    try {
      const notFoundPageHtml = await NotFound.find({});
      return notFoundPageHtml;
    } catch (error) {
      return null;
    }
  }
}

export default MongoDBDataAccessLayer;
