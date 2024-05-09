const jwt = require("jsonwebtoken");
const { User } = require("../models");

function verifyAccount(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    // verifying the token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Acess Denied" });
        return;
      } else {
        // using the jwt token "Id" using the finding here
        const data = await User.findById(decodedToken.userId).select(
          "-__v -password"
        );
        console.log(data);
        if (data) {
          req.user = data;
          next();
        } else {
          res.status(401).json({ message: "Acess Denied" });
          return;
        }
      }
    });
  } else {
    return res.status(401).json({ message: "Acess Denied" });
  }
}

module.exports = verifyAccount;
