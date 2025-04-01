const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const initializePayment = async (amount, email,currency) => {
  try {
    const response = await paystack.transaction.initialize({
      amount: amount * 100,
      email,
      currency: "NGN",
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await paystack.transaction.verify({ reference });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { initializePayment, verifyPayment };
