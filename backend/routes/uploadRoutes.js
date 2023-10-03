import path from "path";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Только изображения");
  }
};

const __dirname = path.resolve();

router.put("/", upload.single("image"), async (req, res) => {
  const { id } = req.body;
  const { buffer, originalname } = req.file;

  try {
    const { image } = await req.db.fetchProductById(id);
    const existingBuffer = await fs.promises.readFile(
      path.join(__dirname, "/uploads", `${id}-main-image.webp`)
    );
    if (Buffer.compare(buffer, existingBuffer) === 0) {
      res.status(304).send(image);
    } else {
      const timestamp = new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9_\\-]/g, "-");
      const updatedImageName = `${timestamp}-${
        originalname.split(".")[0]
      }.webp`;

      await fs.promises.unlink(path.join(__dirname, image));

      await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(path.join(__dirname, "/images", updatedImageName));

      res.send(path.join("/images", updatedImageName));
    }
  } catch (err) {
    console.log(err)
    res.status(404).send(err);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { id } = req.body;
  const { buffer, originalname } = req.file;

  try {
    const timestamp = new Date()
      .toISOString()
      .replace(/[^a-zA-Z0-9_\\-]/g, "-");
    const finalImageName = `${timestamp}-${originalname.split(".")[0]}.webp`;

    await fs.promises.writeFile(
      path.join(__dirname, "/uploads", `${id}-main-image.webp`),
      buffer
    );
    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile(path.join(__dirname, "/images", finalImageName));

    res.send(path.join("/images", finalImageName));
  } catch (e) {
    res.status(404).send(e);
  }
});

export default router;
