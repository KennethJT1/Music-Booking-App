const Artist = require("../models").Artist;
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { artistSchema, updateArtistSchema } = require("../utils/validation");

exports.createArtist = async (req, res) => {
  try {
    const { error } = artistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, bio, genre, socialLinks } = req.body;

    const artist = await Artist.create({
      name,
      email,
      password,
      bio,
      genre,
      socialLinks,
    });

    res
      .status(201)
      .json({ message: "Artist created successfully", data: artist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const artist = await Artist.findOne({ where: { email } });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const isValidPassword = await artist.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: artist.id, email: artist.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    logger.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.status(200).json({ counts: artists.length, data: artists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json({ data: artist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const { error } = updateArtistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    await artist.update(req.body);
    res.status(200).json({ data: artist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    await artist.destroy();
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
