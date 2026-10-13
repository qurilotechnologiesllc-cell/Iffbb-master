import Stripe from 'stripe';
import User from '../../models/userModel.js';
import Course from '../../models/courseModel.js';
import Purchase from '../../models/purchaseModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;

    if (!courseId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "User ID, course ID and email are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Prefer authenticated user when auth middleware is available.
    const user = await User.findOne({
      email: userEmail.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use the email stored against the user.
    const customerEmail = user.email;

    const amountInMinorUnits = Math.round(
      Number(course.actual_price) * 100
    );

    if (
      !Number.isFinite(amountInMinorUnits) ||
      amountInMinorUnits <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      customer_email: customerEmail,

      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: amountInMinorUnits,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url:
        `${process.env.FRONTEND_URL}/success` +
        "?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: `${process.env.FRONTEND_URL}/cancel`,

      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
      },
    });

    // Create the initial Purchase document immediately.
    const purchase = await Purchase.create({
      user: user._id,
      course: course._id,

      amountPaid: session.amount_total / 100,
      currency: session.currency,

      stripeSessionId: session.id,

      customerDetails: session.customer_details ?? null,

      paymentMethodTypes: session.payment_method_types ?? [],

      paymentStatus: session.payment_status ?? "unpaid",

      checkoutStatus: session.status ?? "open",

      // Full response will be saved after payment processing.
      stripeResponse: null,

      enrollmentStatus: "pending",
      confirmationEmailSent: false,
    });

    console.log("Stripe session created:", session.id);
    console.log("Purchase created:", purchase._id);

    return res.status(201).json({
      success: true,
      message: "Checkout session created successfully",
      sessionId: session.id,
      checkoutUrl: session.url,
      purchaseId: purchase._id,
      paymentStatus: purchase.paymentStatus,
    });

  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

export default createCheckoutSession;
