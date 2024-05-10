const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.get("/", (req, res) => {
  res.send("Support team route is working");
});

// Route for creating a support team
// router.post("/signup", async (req, res) => {
//   try {
//     // Check if user is authenticated
//     if (!req.userId) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     // Check if user is an admin
//     if (req.role !== "admin") {
//       return res
//         .status(403)
//         .json({ msg: "Forbidden. Only admins can create support teams." });
//     }

//     // Create support team logic
//     // For example, assuming you have a SupportTeam model:
//     // const supportTeam = await SupportTeam.create({ name: req.body.teamName });
//     const hash = await bcrypt.hash(req.body.password, 10);
//     req.body.password = hash;
//     req.body.loginType = 2;
//     req.body.role = "support team";

//     const user = new User(req.body);
//     await user.save();

//     res.status(201).json({ msg: "Account created successfully ST" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.post("/signup", async (req, res) => {
    try {
      // Check if email is already registered
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email is already registered." });
      }
      // Check if token is provided
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ msg: "Unauthorized. Token not provided." });
      }

      // Verify and decode token
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        console.log(decoded.role);
        if (err) {
          return res.status(401).json({ msg: "Unauthorized. Invalid token." });
        }

        // Check if user is an admin
        if (decoded.role !== "admin") {
          return res
            .status(403)
            .json({ msg: "Forbidden. Only admins can create support teams." });
        }

        // Create support team logic
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        req.body.loginType = 2;
        req.body.role = "support team";

        const user = new User(req.body);
        await user.save();

        res.status(201).json({ msg: "Account created successfully ST" });
      });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
