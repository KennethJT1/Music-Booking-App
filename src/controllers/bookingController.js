const Booking = require("../models").Booking;
const Event = require("../models").Event;
const { initializePayment } = require("../utils/paystack");
const dotenv = require("dotenv").config();
const crypto = require("node:crypto");
const { sendBookingConfirmation } = require("../utils/sendBookingEmail");
const logger = require("../utils/logger");
const { bookingSchema } = require("../utils/validation");

exports.bookEvent = async (req, res) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { eventId, name, email } = req.body;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const currentDate = new Date();
    if (new Date(event.date) < currentDate) {
      return res.status(400).json({
        message: "You cannot book an event that has closed",
      });
    }

    const paymentAmount = event.amount;
    const currency = event.currency;

    const payment = await initializePayment(
      paymentAmount,
      email,
      currency,
      eventId
    );

    const booking = await Booking.create({
      eventId,
      name,
      currency,
      paymentStatus: "unpaid",
      paymentAmount,
      transactionId: payment.data.reference,
    });

    res.status(200).json({
      message: "Booking initiated",
      booking,
      data: payment.data.authorization_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ counts: bookings.length, data: bookings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ data: booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.handlePaymentCallback = async (req, res) => {
  try {
    const hash = req.headers["x-paystack-signature"];
    const payload = JSON.stringify(req.body);
    const computedHash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (hash !== computedHash) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body;
    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data;
      const eventId = metadata.eventId;

      const eventDetails = await Event.findByPk(eventId);

      if (!eventDetails) {
        return res.status(404).json({ message: "Event not found" });
      }

      const booking = await Booking.findOne({
        where: { transactionId: reference },
      });

      if (booking) {
        await Booking.update(
          {
            status: "confirmed",
            paymentStatus: "paid",
            paymentAmount: amount / 100,
          },
          { where: { id: booking.id } }
        );

        await sendBookingConfirmation(customer, booking, eventDetails);

        logger.info(
          `Payment successful: Reference=${reference}, Amount=${amount}, Customer=${customer.email}`
        );
      }
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    logger.error("Error processing webhook:", error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
