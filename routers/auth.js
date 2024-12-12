const express = require("express");
const router = express.Router();
require("dotenv").config();

const User = require("../models/User");
const UserService = require("../services/UserServices");
const { verifyToken } = require("../middleware/auth");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  //Simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });

  try {
    //check for existing user
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Đã có người sử dụng tài khoản này" });

    //All good
    const hashedPassword = await UserService.hashPassword(password);

    const newUser = new User({ username, password: hashedPassword, name });
    await newUser.save();

    //return token
    const accessToken = UserService.getAccessToken(newUser._id);

    return res.json({
      success: true,
      message: "Tạo tài khoản thành công",
      accessToken,
    });
  } catch (e) {
    console.log(e.message);

    return res.status(500).json({ message: "Internal server error" }).end();
  }
});

// @route POST api/auth/login
// @desc User login
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    // Username found
    const isSamePassword = await UserService.verifyHashedPassword(
      user.password,
      password
    );
    if (!isSamePassword)
      return res
        .status(400)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    // return token
    const accessToken = UserService.getAccessToken(user._id);

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal server error" }).end();
  }
});

// @route GET api/auth/me
// @desc Get user
// @access Private
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Không tìm thấy dữ liệu người dùng" });

    return res.json({ success: true, message: "User found", data: user });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal server error" }).end();
  }
});

// @route GET api/auth/shipper
// @desc Get shipper
// @access Private
router.get("/shipper", verifyToken, async (req, res) => {
  try {
    const user = await User.find({ role: "SHIPPER" }).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Không tìm thấy dữ liệu người dùng" });

    return res.json({
      success: true,
      message: "Đã lấy được thông tin các Shipper",
      data: user,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal server error" }).end();
  }
});

module.exports = router;
