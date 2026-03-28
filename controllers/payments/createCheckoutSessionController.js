import Stripe from 'stripe';
import Course from '../../models/courseModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.actual_price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        courseId: course._id.toString(),
      },
    });
    console.log("🔥 FRONTEND_URL USED BY STRIPE:", process.env.FRONTEND_URL);

    // ✅ IMPORTANT CHANGE
    return res.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

export default createCheckoutSession;
