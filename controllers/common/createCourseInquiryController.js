import CourseInquiry from "../../models/courseInquiryModel.js";

const createCourseInquiryController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      course,
      state,
      message,
      termsAccepted,
    } = req.body;

    // 🔐 Validation
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !course ||
      !state ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must accept terms and conditions",
      });
    }

    const inquiry = await CourseInquiry.create({
      name,
      email,
      phone,
      dob,
      course,
      state,
      message,
      termsAccepted,
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiry,
    });

  } catch (error) {
    console.error("Create course inquiry error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};

export default createCourseInquiryController;

