import Stripe from "stripe";
import Course from "../../models/courseModel.js";
import Purchase from "../../models/purchaseModel.js";
import CourseProgress from "../../models/CourseProgressModel.js";
import User from "../../models/userModel.js";
import { sendThankYouMail } from "../../utils/sendMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeSuccessController = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: "Session ID missing",
            });
        }

        // 1. Retrieve the latest Checkout Session from Stripe.
        const session = await stripe.checkout.sessions.retrieve(session_id);

        console.log("Retrieved Stripe session:", session);

        // 2. Find the existing Purchase document.
        const purchase = await Purchase.findOne({
            stripeSessionId: session.id,
        });

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase record not found",
            });
        }

        // 3. Verify the session belongs to the saved course.
        if (
            session.metadata?.courseId !== purchase.course.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Stripe session does not match the purchase",
            });
        }

        if (session.mode !== "payment") {
            return res.status(400).json({
                success: false,
                message: "Invalid Stripe Checkout Session mode",
            });
        }

        // 4. Update the existing Purchase with the latest Stripe data.
        purchase.customerDetails = session.customer_details ?? null;

        purchase.paymentMethodTypes =
            session.payment_method_types ?? [];

        purchase.paymentStatus =
            session.payment_status ?? "unpaid";

        purchase.checkoutStatus =
            session.status ?? "open";

        // Store the complete Stripe Checkout Session response.
        purchase.stripeResponse = JSON.parse(JSON.stringify(session));

        if (session.amount_total != null) {
            purchase.amountPaid = session.amount_total / 100;
        }

        if (session.currency) {
            purchase.currency = session.currency;
        }

        await purchase.save();

        // 5. Do not enroll until Stripe confirms payment.
        if (session.payment_status !== "paid") {
            return res.status(200).json({
                success: false,
                message: "Payment is not completed",
                purchaseId: purchase._id,
                paymentStatus: purchase.paymentStatus,
                checkoutStatus: purchase.checkoutStatus,
            });
        }

        // 6. Load the user and course from the saved Purchase.
        const [user, course] = await Promise.all([
            User.findById(purchase.user),
            Course.findById(purchase.course),
        ]);

        if (!user || !course) {
            return res.status(404).json({
                success: false,
                message: "User or course not found",
                purchaseId: purchase._id,
            });
        }

        // 7. If this purchase was already processed, don't enroll again.
        if (purchase.enrollmentStatus === "completed") {
            return res.status(200).json({
                success: true,
                message: "Payment already processed",
                purchaseId: purchase._id,
                courseId: course._id,
                paymentStatus: purchase.paymentStatus,
                checkoutStatus: purchase.checkoutStatus,
                enrollmentStatus: purchase.enrollmentStatus,
            });
        }

        // 8. Ensure the user has this Purchase ID in purchasedCourses.
        await User.updateOne(
            { _id: user._id },
            { $addToSet: { purchasedCourses: purchase._id } }
        );

        // 9. Create course progress only if it doesn't exist.
        let progress = await CourseProgress.findOne({
            user: user._id,
            course: course._id,
        });

        let progressCreated = false;

        if (!progress) {
            try {
                progress = await CourseProgress.create({
                    user: user._id,
                    course: course._id,
                    modulesProgress: course.modules.map((module) => ({
                        moduleId: module._id,
                    })),
                    currentUnlockedModuleIndex: 0,
                });

                progressCreated = true;
            } catch (error) {
                // Another concurrent request may have created the progress.
                if (error.code !== 11000) {
                    throw error;
                }

                progress = await CourseProgress.findOne({
                    user: user._id,
                    course: course._id,
                });

                if (!progress) {
                    throw error;
                }
            }
        }

        // Increment only when this request creates the progress record.
        if (progressCreated) {
            await Course.updateOne(
                { _id: course._id },
                { $inc: { total_enrolled_user: 1 } }
            );
        }

        // 10. Mark enrollment complete after enrollment operations.
        purchase.enrollmentStatus = "completed";
        await purchase.save();

        // 11. Send confirmation email.
        if (!purchase.confirmationEmailSent) {
            try {
                await sendThankYouMail(
                    user.email,
                    course.title,
                    session.amount_total / 100,
                    session.currency
                );

                purchase.confirmationEmailSent = true;
                await purchase.save();

                console.log(
                    "Purchase confirmation email sent:",
                    user.email
                );
            } catch (emailError) {
                console.error(
                    "Failed to send purchase confirmation email:",
                    emailError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Payment successful, course enrolled",
            purchaseId: purchase._id,
            courseId: course._id,
            paymentStatus: purchase.paymentStatus,
            checkoutStatus: purchase.checkoutStatus,
            enrollmentStatus: purchase.enrollmentStatus,
            confirmationEmailSent: purchase.confirmationEmailSent,
        });
    } catch (error) {
        console.error("Stripe success error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};

export default stripeSuccessController;
