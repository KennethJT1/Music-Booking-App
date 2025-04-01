const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.post("/book-event", bookingController.bookEvent);
router.get("/webhook", bookingController.handlePaymentCallback);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
