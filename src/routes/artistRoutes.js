const express = require("express");
const artistController = require("../controllers/artistController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", artistController.createArtist);
router.post("/login", artistController.login);
router.get("/", artistController.getAllArtists);
router.get("/:id",authMiddleware, artistController.getArtistById);
router.put("/:id",authMiddleware, artistController.updateArtist);
router.delete("/:id",authMiddleware, artistController.deleteArtist);

module.exports = router;
