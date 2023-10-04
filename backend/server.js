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

app.use(express.static(path.join(__dirname, "/frontend", "/build")));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
);

app.use(async (req) => {
  if (!req.headers.referer) return
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

  const newData = JSON.stringify(links);
  await fs.promises.writeFile(filePath, newData);

  if (isUpdated) {
    const data = await fs.promises.readFile(filePath, (err) => {
      console.log(err);
    });

    let siteMapContent = "";
    const links = JSON.parse(data);
    links.map((item) => {
      siteMapContent +=
        `<url><loc>http://161.35.68.81/${item}</loc></url>` + os.EOL;
    });

    const newContent =  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapContent}
    </urlset>`;

    await fs.promises.writeFile(
      path.join(__dirname, "/frontend", "/public", "sitemap.xml"),
      newContent,
      (err) => {
        if (err) console.log("Ошибка", err);
      }
    );
    isUpdated = false
  }
});

app.get("*", async (req, res) => {
  const page = await req.db.get404PageHtml();
  res.send(page[0].text).status(404);
});

const PORT = 3000;

app.listen(PORT, console.log("Сервер запущен на порту " + PORT));
