import express from 'express';
const router = express.Router();
import getAllCourseController from '../../controllers/admin/course/getAllCourseController.js';
import adminAuthMiddleware from '../../middleware/adminAuthMiddleware.js';
import getAllUsersController from '../../controllers/admin/user/getAllUsersController.js';
import banUnbanUserController from '../../controllers/admin/user/banUnbanUserController.js';
import { adminAnalyticsController } from '../../controllers/admin/analytics/adminAnalyticsController.js';
// router.get('/get-all-courses', adminAuthMiddleware, getAllCourseController);

router.get('/get-all-courses', adminAuthMiddleware, getAllCourseController);

// For Admin Control Over User
router.get('/get-all-users', adminAuthMiddleware, getAllUsersController);

router.post('/ban-unban-user/:userId', adminAuthMiddleware, banUnbanUserController);

//Admin Stats.
router.get('/get-stats', adminAuthMiddleware, adminAnalyticsController);
export default router;
