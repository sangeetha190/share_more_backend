const router = require("express").Router();
const bcryt = require("bcrypt");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const verifyAccount = require("../middleware/verifyToken");

router.get("/", (req, res) => {
  res.json({ msg: "From User route" });
});

router.post("/signup", async (req, res) => {
  const salt = await bcryt.genSalt(10);
  const passwordHash = await bcryt.hash(req.body.password, salt);

  console.log(passwordHash);
  // create user in DB
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: passwordHash,
    contactNumber: req.body.contactNumber,
  });

  // creating the token using "user_id and secrect_key"
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
  res.json({ token });
});
//https://localhost:4000/api/user/signup
// {
//   "name":"sample2 test",
//   "email":"sample2@gmail.com",
//   "password":"sample123",
//   "contactNumber":1234567890
// }
// ==================================================

// verifyAccount
router.get("/get/data", verifyAccount, (req, res) => {
  res.json(req.user);
});
// ==================================================
// login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const result = await User.findOne({ email: email });

  if (result) {
    bcryt.compare(password, result.password).then((passwordResult) => {
      if (passwordResult == true) {
        jwt.sign(
          { userId: result._id },
          process.env.SECRET_KEY,
          (err, token) => {
            if (err) {
              console.log(err);
            } else {
              res
                .status(200)
                .json({ success: true, msg: "Login Successful", token: token });
            }
          }
        );
      } else {
        res.status(401).json({ success: false, msg: "Incorrect Password" });
      }
    });
  } else {
    res.status(401).json({ success: false, msg: "User Not Registered" });
  }
});

module.exports = router;
