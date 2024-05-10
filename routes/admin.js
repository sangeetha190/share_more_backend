const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.send("Admin route is working");
});

// router.post("/signup", async (req, res) => {
//   try {
//     const hash = await bcrypt.hash(req.body.password, 10);
//     req.body.password = hash;
//     req.body.loginType = 1;
//     req.body.role = "admin";

//     const user = new User(req.body);
//     await user.save();

//     res.json({ msg: "Account created Successfully" });
//   } catch (error) {
//     res.json({ msg: error.message });
//   }
// });

module.exports = router;
