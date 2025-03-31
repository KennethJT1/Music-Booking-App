const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();

router.post("/book-event", bookingController.bookEvent);
router.get("/payment-callback", bookingController.handlePaymentCallback);
router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
