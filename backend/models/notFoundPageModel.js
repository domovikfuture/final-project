import mongoose from "mongoose";

const notFoundPageSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const NotFound = mongoose.model("NotFound", notFoundPageSchema);

export default NotFound;
