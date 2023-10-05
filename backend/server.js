import path from "path";
import express from "express";
import dotenv from "dotenv";
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

const validRoutes = [
  "/order",
  "/shipping",
  "/payment",
  "/placeorder",
  "/login",
  "/register",
  "/profile",
  "/product",
  "/cart",
  "/smartphones",
  "/tv",
  "/notebooks",
  "/games",
  "/search",
  "/page",
  "/",
];
const host_for_sitemap = "161.35.68.81";

const __dirname = path.resolve();
const app = express();
let dataAccessLayer = null;

if (!dataAccessLayer) {
  dataAccessLayer = new MongoDBDataAccessLayer();
  dataAccessLayer.connect();
}

app.use(express.json());

app.use((req, res, next) => {
  req.db = dataAccessLayer;
  next();
});

app.use(async (req, res, next) => {
  if (!req.headers.referer) return next();
  const { pathname } = new URL(req.headers.referer || "");
  const filePath = path.join(__dirname, "backend", "links.json");
  console.log(req.headers.referer)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads")
  ) {
    return next();
  }

  if (!validRoutes.some(route => pathname.startsWith(route))) {
    return next();
}

  if (!fs.existsSync(filePath)) {
    await fs.promises.writeFile(filePath, JSON.stringify([]));
  }

  let links = JSON.parse(await fs.promises.readFile(filePath, "utf-8"));

  if (!links.includes(pathname)) {
    links.push(pathname);

    await fs.promises.writeFile(filePath, JSON.stringify(links));

    let sitemapContent = links
      .map((link) => `<url><loc>http://${host_for_sitemap}${link}</loc></url>`)
      .join(os.EOL);
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
                        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                          ${sitemapContent}
                        </urlset>`;
    await fs.promises.writeFile(
      path.join(__dirname, "frontend", "public", "sitemap.xml"),
      sitemapXml
    );
  }

  next();
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/products", cacheRequest(), productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", cacheRequest(), orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", cacheRequest(), adminRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.get("/404", async (req, res) => {
  const page = await req.db.get404PageHtml();
  res.send(page[0].text).status(404);
});

app.use(express.static(path.join(__dirname, "/frontend", "/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
);

const PORT = 3000;

app.listen(PORT, console.log("Сервер запущен на порту " + PORT));
