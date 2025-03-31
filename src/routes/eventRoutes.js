
const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/', authMiddleware,eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id',authMiddleware, eventController.updateEvent);
router.delete('/:id',authMiddleware, eventController.deleteEvent);

module.exports = router;