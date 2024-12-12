const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  cod: {
    type: Number,
    required: true,
  },
  products: {
    type: [],
  },
  page: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["GRAB", "AHAMOVE", "SHIPPER", "GHN"],
  },
  deliveredBy: {
    type: Schema.Types.ObjectId || undefined,
    ref: "users",
    required: false,
  },
  status: {
    type: String,
    enum: ["CREATED", "TO SHIP", "SHIPPING", "SHIPPED", "CANCEL"],
    default: "CREATED",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("orders", schema);
