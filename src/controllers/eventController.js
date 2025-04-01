const Event = require("../models").Event;
const { eventSchema, updateEventSchema } = require("../utils/validation");
const Artist = require("../models").Artist;

exports.createEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { error } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const artistName = await Artist.findByPk(req.user).then(
      (artist) => artist.name
    );

    const eventData = {
      ...req.body,
      artistName,
      artistId: req.user,
    };

    const event = await Event.create(eventData);
    res
      .status(201)
      .json({ message: "Event created successfully", data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ counts: events.length, data: events });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { error } = updateEventSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.update(req.body);
    res.status(200).json({ data: event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
