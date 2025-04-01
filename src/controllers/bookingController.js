const Booking = require("../models").Booking;
const Event = require("../models").Event;
const { initializePayment, verifyPayment } = require("../utils/paystack");

exports.bookEvent = async (req, res) => {
  const { eventId, name, email } = req.body;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const currentDate = new Date();
    if (new Date(event.date) < currentDate) {
      return res.status(400).json({
        message: "You cannot book an event that has closed",
      });
    }

    const paymentAmount = event.amount;
    const currency = event.currency;

    const payment = await initializePayment(paymentAmount, email, currency);

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

exports.handlePaymentCallback = async (req, res) => {
  try {
    const hash = req.headers["x-paystack-signature"];
    const payload = JSON.stringify(req.body);

    // Verify the webhook signature
    const computedHash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (hash !== computedHash) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Process the event
    const event = req.body;

    if (event.event === "charge.success") {
      const { reference, amount, currency, customer } = event.data;

      // Find the booking associated with the payment reference
      const booking = await Booking.findOne({
        where: { transactionId: reference },
      });

      if (booking) {
        // Update the booking status to "paid"
        await Booking.update(
          { paymentStatus: "paid", paymentAmount: amount / 100 }, // Convert amount from kobo to naira
          { where: { id: booking.id } }
        );

        console.log(
          `Payment successful: Reference=${reference}, Amount=${amount}, Customer=${customer.email}`
        );
      }
    }

    // Respond to Paystack to acknowledge receipt of the webhook
    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
