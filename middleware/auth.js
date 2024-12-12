const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Hãy đăng nhập lại" })
      .end();

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decode.userId;
    next();
  } catch (e) {
    console.log(e);

    return res
      .status(403)
      .json({ success: false, message: "Invalid Token" })
      .end();
  }
};

// const verifyTokenAdmin = (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ success: false, message: 'Hãy đăng nhập lại' });

//   try {
//     const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.userId = decode.userId;
//     const role = decode.role;
//     if (role !== 'ADMIN')
//       return res
//           .status(401)
//           .json({ success: false, message: 'Bạn thiếu quyền thực hiện hành động này' });
//     next();
//   } catch (e) {
//     console.log(e);

//     return res.status(403).json({ success: false, message: 'Invalid Token' }).end();
//   }
// };

module.exports = {
  verifyToken,
  // verifyTokenAdmin
};
