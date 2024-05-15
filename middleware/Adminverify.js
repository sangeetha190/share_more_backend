const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Access denied: Invalid token" });
      } else {
        // Check if the decoded token has the admin role
        if (decodedToken.role === "admin") {
          // Proceed to the next middleware if the user is an admin
          next();
        } else {
          // If the user is not an admin, deny access
          return res
            .status(403)
            .json({ message: "Access denied: Only admin users are allowed" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyAdmin;
