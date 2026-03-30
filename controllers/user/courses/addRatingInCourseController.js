import Course from "../../../models/courseModel.js";
import User from "../../../models/userModel.js";
import Purchase from "../../../models/purchaseModel.js";

export const AddRatingInCourse = async (req, res) => {
    try {
        const { user_id, course_id, value, review } = req.body;

        // Validate rating value
        if (!value || value < 1 || value > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating value must be between 1 and 5",
            });
        }

        // STEP 1: Find the user
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // STEP 2: Get purchasedCourses array from user
        const purchasedCourseIds = user.purchasedCourses; // array of purchase _ids

        if (!purchasedCourseIds || purchasedCourseIds.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You have not purchased any course",
            });
        }

        // STEP 3: Find purchase record where purchase._id is in user.purchasedCourses
        // and purchase.course matches course_id
        const purchaseRecord = await Purchase.findOne({
            _id: { $in: purchasedCourseIds },
            course: course_id,
            paymentStatus: "paid",
        });

        if (!purchaseRecord) {
            return res.status(403).json({
                success: false,
                message: "You have not purchased this course. Please buy the course to add a rating",
            });
        }

        // STEP 4: Find the course
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // STEP 5: Check if user has already rated this course
        const alreadyRated = course.ratings.find(
            (r) => r.userId.toString() === user_id.toString()
        );

        if (alreadyRated) {
            return res.status(400).json({
                success: false,
                message: "You have already rated this course",
            });
        }

        // STEP 6: Push new rating into course ratings array
        course.ratings.push({
            userId: user_id,
            value,
            review,
            createdAt: new Date(),
        });

        await course.save();

        // STEP 7: Calculate updated average rating
        const totalRatings = course.ratings.length;
        const averageRating =
            course.ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings;

        return res.status(200).json({
            success: true,
            message: "Rating added successfully",
            data: {
                totalRatings,
                averageRating: parseFloat(averageRating.toFixed(1)),
            },
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
