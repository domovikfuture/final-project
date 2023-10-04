import path from "path";
import loadStaticTest from "./staticTest";

const __dirname = path.resolve();

const imagesDir = path.resolve(__dirname, "images");

loadStaticTest(imagesDir, 'images')