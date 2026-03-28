import express from 'express';
import userSignUpController from '../../controllers/user/auth/userSignupController.js';
import userLoginController from '../../controllers/user/auth/userLoginController.js';
import userLogoutController from '../../controllers/user/auth/userLogoutController.js';
import {userForgotController, verifyOtpAndUpdatePassword} from "../../controllers/user/auth/userForgotController.js"
import { useSignUpValidator } from '../../validators/userSignUpValidator.js';
import { userLoginValidator } from '../../validators/userLogInValidator.js';
import { authenticateUser } from '../../utils/middlwares.js';
import getUserProfileController from '../../controllers/admin/user/profile/getUserProfileController.js';
import userAuthMiddleware from '../../middleware/userAuthMiddleware.js';

const router = express.Router();

router.post('/user-sign-up', useSignUpValidator, userSignUpController);
router.post('/user-log-in', userLoginValidator, userLoginController);
router.post('/user-log-out', authenticateUser, userLogoutController);
router.get('/user-profile', authenticateUser, getUserProfileController);
router.post('/user-forgot-password', userForgotController);
router.post('/user/change-password', verifyOtpAndUpdatePassword);


export default router;
