import Stripe from "stripe";
import Course from "../../models/courseModel.js";
import Purchase from "../../models/purchaseModel.js";
import CourseProgress from "../../models/CourseProgressModel.js";
import User from "../../models/userModel.js";

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

        // 1️⃣ Stripe session verify
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment not successful",
            });
        }

        // 2️⃣ Course
        const courseId = session.metadata.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // 3️⃣ User
        const user = await User.findOne({ email: session.customer_email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 4️⃣ Duplicate purchase avoid
        const alreadyPurchased = await Purchase.findOne({
            stripeSessionId: session.id,
        });

        if (alreadyPurchased) {
            return res.json({
                success: true,
                message: "Payment already processed",
                courseId,
            });
        }

        // 5️⃣ Save purchase
        const purchase = await Purchase.create({
            user: user._id,
            course: courseId,
            amountPaid: session.amount_total / 100,
            currency: session.currency,
            stripeSessionId: session.id,
            paymentStatus: "paid",
        });

        // 6️⃣ Update user → store purchaseId instead of courseId
        if (!user.purchasedCourses.includes(purchase._id)) {
            user.purchasedCourses.push(purchase._id);
            await user.save();
        }

        // 7️⃣ Increment enrolled user count
        await Course.findByIdAndUpdate(
            courseId,
            { $inc: { total_enrolled_user: 1 } },
            { new: true }
        );

        // 7️⃣ Create course progress
        await CourseProgress.create({
            user: user._id,
            course: courseId,
            modulesProgress: course.modules.map((m) => ({
                moduleId: m._id,
            })),
            currentUnlockedModuleIndex: 0,
        });

        return res.json({
            success: true,
            message: "Payment successful, course enrolled",
            purchaseId: purchase._id,
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
