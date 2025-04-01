const jwt = require("jsonwebtoken");
const Artist = require("../models").Artist;

const authMiddleware = async (req, res, next) => {
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
