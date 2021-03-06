let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let productSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "price is required"],
    min: [0, "price can not be lower than 0"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
