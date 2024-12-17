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
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
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
  desc: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("orders", schema);
