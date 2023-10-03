import express from "express";
const router = express.Router();
import { set404Page, get404page } from "../controllers/adminController.js";

router
  .route("/notfoundredactor")
  .post(set404Page)
  .get(get404page);

export default router;
