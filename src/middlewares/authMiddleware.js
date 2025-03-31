const jwt = require("jsonwebtoken");
const Artist = require("../models").Artist;

const authMiddleware = async (req, res, next) => {
  //   const token = req.headers["authorization"];
  //   if (!token) {
  //     return res.status(403).json({ message: "No token provided" });
  //   }
  // console.log(process.env.JWT_SECRET)
  //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //     if (err) {
  //       return res.status(401).json({ message: "Unauthorized" });
  //     }
  //     req.user = decoded.id;
  //     next();
  //   });
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    if (!id) {
      return res.status(401).json({ error: "Invalid token structure" });
    }

    const user = await Artist.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = id;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
