import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const BookModel =
  mongoose.models.Book || mongoose.model("Book", BookSchema);
