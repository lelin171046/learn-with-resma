const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (course, user, successUrl, cancelUrl) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
            description: course.shortDescription,
            images: course.thumbnail ? [course.thumbnail] : [],
          },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      courseId: course._id.toString(),
      userId: user._id.toString(),
    },
  });
  return session;
};

module.exports = { createCheckoutSession };
