const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const verifyAccount = require("../middleware/verifyToken");
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
// login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ success: false, msg: "User Not Registered" });
  }

  bcrypt
    .compare(password, user.password)
    .then((passwordResult) => {
      if (passwordResult) {
        const payload = {
          userId: user._id,
          role: user.role, // Include user's role in the token payload
        };

        jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, msg: "Server error" });
          }
          res
            .status(200)
            .json({ success: true, msg: "Login Successful", token: token });
        });
      } else {
        res.status(401).json({ success: false, msg: "Incorrect Password" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, msg: "Server error" });
    });
});

module.exports = router;
