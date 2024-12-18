const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const { verifyToken } = require("../middleware/auth");

const validation = ({ name, phoneNumber, address, cod, type }) => {
  return !name || !phoneNumber || !address || !cod || !type;
};

const formatToObjectId = (_id) => {
  return new mongoose.Types.ObjectId(_id);
};

// @route GET api/order
// @desc Get all orders
// @access Public
router.get("/", async (req, res) => {
  try {
    const data = await Order.find({}).sort({ _id: -1 }).populate(["createdBy"]);

    return res.json({
      success: true,
      message: "Get all data successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message }).end();
  }
});

// @route GET api/order
// @desc Get all orders between two dates
// @access Public
router.post("/filter", async (req, res) => {
  try {
    const { since, until, filter } = req.body;

    const data = await Order.find({
      createdAt: {
        $gte: new Date(since),
        $lte: new Date(until),
      },
      ...filter,
    })
      .sort({
        createdAt: -1,
      })
      .populate(["createdBy"]);

    return res.json({
      success: true,
      message: "Get data successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message }).end();
  }
});

// @route GET api/order
// @desc Get an orders
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Order.findOne({ _id: formatToObjectId(id) });
    if (!data)
      return res.status(400).json({
        success: false,
        message: `Không thể tìm thấy đơn hàng với ID: ${id}`,
      });

    return res.json({
      success: true,
      message: "Lấy đơn hàng thành công",
      data,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: error.message }).end();
  }
});

// @route POST api/order
// @desc Create new order
// @access Private
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      address,
      cod,
      products,
      page,
      type,
      status,
      deliveredBy,
      desc,
      createdBy,
    } = req.body;

    //Simple validation
    if (validation(req.body))
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });

    const newOrder = new Order({
      name,
      phoneNumber,
      address,
      cod,
      products,
      page,
      type,
      status,
      deliveredBy,
      desc,
      createdBy: createdBy._id,
    });

    // if (type === "SHIPPER" && deliveredBy) newOrder.deliveredBy = deliveredBy;

    await newOrder.save();
    return res.json({
      success: true,
      message: "Tạo đơn hàng thành công",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message }).end();
  }
});

// @route PUT api/order/:id
// @desc Update an order
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const newOrder = req.body;

    //Simple validation
    if (validation(newOrder))
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });

    if (newOrder.type !== "SHIPPER") newOrder.deliveredBy = null;

    const { id } = req.params;
    Order.findOneAndUpdate(formatToObjectId(id), newOrder)
      .then(() =>
        res
          .json({ success: true, message: "Cập nhật đƠn hàng thành công" })
          .end()
      )
      .catch((err) =>
        res
          .status(400)
          .json({
            success: false,
            message: err.message,
          })
          .end()
      );
  } catch (error) {
    return res.status(500).json({ message: error.message }).end();
  }
});

// @route DELETE api/order/:id
// @desc Delete an order
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Không lấy được Id cần xoá" });

    await Order.deleteOne({ _id: formatToObjectId(id) });

    return res.json({ success: true, message: `Đã xoá đơn hàng đã chọn` });
  } catch (e) {
    return res.status(500).json({ message: error.message }).end();
  }
});

module.exports = router;
