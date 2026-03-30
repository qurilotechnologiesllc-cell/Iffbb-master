import CourseInquiry from "../../../models/courseInquiryModel.js";

export const getAllCourseInquiriesController = async (req, res) => {
  try {
    const inquiries = await CourseInquiry.find({ status: { $ne: "seen" } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Get inquiries error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};


export const seenNotificationController = async (req, res) => {
  try {
    const { notification_id } = req.params

    const response = await CourseInquiry.findByIdAndUpdate(notification_id,
      { status: "seen" },      // update field
      { new: true }
    )
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as seen",
      data: response,
    });

  } catch (error) {
    console.error("Seen error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Check if notification exists
    const notification = await CourseInquiry.findById(notification_id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Delete the notification
    await CourseInquiry.findByIdAndDelete(notification_id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

