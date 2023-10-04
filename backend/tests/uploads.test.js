import path from "path";
import loadStaticTest from "./staticTest";

const __dirname = path.resolve();

const uploadsDir = path.resolve(__dirname, "uploads");

loadStaticTest(uploadsDir, 'uploads')

