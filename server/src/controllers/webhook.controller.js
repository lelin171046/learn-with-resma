const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const { generateInvoiceNumber } = require('../utils/helpers');

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { courseId, userId } = session.metadata;

    try {
      const payment = await Payment.findOne({ stripeSessionId: session.id });
      if (payment) {
        payment.status = 'completed';
        payment.invoiceNumber = generateInvoiceNumber();
        payment.stripePaymentIntentId = session.payment_intent;
        await payment.save({ validateBeforeSave: false });
      }

      const user = await User.findById(userId);
      if (user && !user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save({ validateBeforeSave: false });
      }

      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  res.json({ received: true });
};

module.exports = { handleWebhook };
