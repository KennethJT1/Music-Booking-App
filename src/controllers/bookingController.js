const Booking = require("../models/booking");
const Event = require("../models/event");

const { initializePayment, verifyPayment } = require("../utils/paystack");

exports.bookEvent = async (req, res) => {
  const { eventId, name, email, paymentAmount } = req.body;

  try {
    const payment = await initializePayment(paymentAmount, email);

    const booking = await Booking.create({
      eventId,
      name,
      paymentStatus: "unpaid",
      paymentAmount,
    });

    res.status(200).json({
      message: "Booking initiated",
      booking,
      paymentUrl: payment.data.authorization_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handlePaymentCallback = async (req, res) => {
  const { reference } = req.query;

  try {
    const payment = await verifyPayment(reference);

    if (payment.data.status === "success") {
      await Booking.update(
        { paymentStatus: "paid", transactionId: reference },
        { where: { id: req.params.bookingId } }
      );
      res.status(200).json({ message: "Payment successful" });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const event = await Event.findByPk(req.body.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const booking = await Booking.create({ ...req.body, userId: req.userId });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.update(req.body);
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
