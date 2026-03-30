import express from 'express';

// Controllers
import userPurchasedCoursesController from '../../controllers/user/courses/userPurchasedCoursesController.js';
import { getAllCoursesController } from '../../controllers/user/courses/getAllCoursesController.js';
import { getUserProfileController } from '../../controllers/user/data/getUserProfileController.js';
import { getUserOneCourseController } from '../../controllers/user/courses/getUserOneCourseController.js';
import markModuleCompleteController from '../../controllers/user/courses/markModuleCompleteController.js';
import submitTestController from '../../controllers/user/courses/submitTestController.js';
import getTestResultController from "../../controllers/user/courses/getTestResultController.js";
// ✅ Correct - named import
import { AddRatingInCourse } from "../../controllers/user/courses/addRatingInCourseController.js"
// Middlewares
import userAuthMiddleware from '../../middleware/userAuthMiddleware.js';


const router = express.Router();

/**
 * 🔐 Get logged-in user's purchased courses
 * Only logged-in users
 */
router.get(
  '/get-one-course/:courseId',
  userAuthMiddleware,
  getUserOneCourseController
);

router.get(
  '/purchased-courses',
  userAuthMiddleware,
  userPurchasedCoursesController
);

/**
 * 🔐 Get logged-in user's profile
 * Only logged-in users
 */
router.get(
  '/user-profile',
  userAuthMiddleware,
  getUserProfileController
);

/**
 * 🌍 Public – Get all courses
 * Guest + logged-in both
 */
router.get(
  '/get-all-courses',
  getAllCoursesController
);

router.post(
  "/course/:courseId/module/:moduleId/complete",
  userAuthMiddleware,
  markModuleCompleteController
);

router.post(
  "/course/:courseId/module/:moduleId/test",
  userAuthMiddleware,
  submitTestController
);


router.get(
  "/course/:courseId/module/:moduleId/test-result",
  userAuthMiddleware,
  getTestResultController
);

router.post(
  "/course/user-rating",
  userAuthMiddleware,
  AddRatingInCourse
)


export default router;
