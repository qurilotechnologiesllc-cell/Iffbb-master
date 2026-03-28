import express from 'express';
import createCheckoutSessionController from '../../controllers/payments/createCheckoutSessionController.js';
import stripeSuccessController from "../../controllers/payments/stripeSuccessController.js";
import { authenticateUser } from '../../utils/middlwares.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSessionController);
router.get("/stripe-success", stripeSuccessController);

export default router;
