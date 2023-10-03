import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import fs from "fs";
import os from "os";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import MongoDBDataAccessLayer from "./models/index.js";

import cacheRequest from "./utils/cacheRequest.js";

dotenv.config();

const app = express();

let dataAccessLayer = null;

if (!dataAccessLayer) {
  dataAccessLayer = new MongoDBDataAccessLayer();
  dataAccessLayer.connect();
}

app.use((req, res, next) => {
  console.log("1 request");
  req.db = dataAccessLayer;
  next();
});

app.use(async (req, res, next) => {
  const { pathname } = new URL(req.headers.referer);
  const filePath = path.join(__dirname, "/backend", "links.json");
  let isUpdated = false;

  const data = await fs.promises.readFile(filePath);
  const links = JSON.parse(data);

  if (!links.length) {
    links.push(pathname);
  } else if (!links.includes(pathname)) {
    isUpdated = true;
    links.push(pathname);
  }
  await fs.promises.writeFile(filePath, JSON.stringify(links));

  if (isUpdated) {
    fs.readFile(filePath, (err, data) => {
      const links = JSON.parse(data);
      let siteMapContent = "";
      links.map((item) => {
        siteMapContent +=
          `<url><loc>${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}${item}</loc></url>` +
          os.EOL;
      });
      fs.writeFile(
        path.join(__dirname, "/frontend", "/public", "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${siteMapContent}
          </urlset>`,
        (err) => {
          if (err) console.log(err);
          isUpdated = false;
        }
      );
    });
  }

  next();
});

app.use(express.json());

app.use("/api/products", cacheRequest(), productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", cacheRequest(), orderRoutes);
app.use("/api/upload", cacheRequest(), uploadRoutes);
app.use("/api/admin", cacheRequest(), adminRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/static", express.static(path.join(__dirname, "/static")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Сервер запущен.");
  });
}

app.get("*", async (req, res) => {
  const page = await req.db.get404PageHtml();
  res.send(page[0].text).status(404);
});

const PORT = 5000;

app.listen(PORT, console.log("Сервер запущен"));
