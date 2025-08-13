import express from 'express';
import paymentController from './payment.controller';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';

const paymentRoutes = express.Router();

paymentRoutes.post('/create-checkout-session', auth(userRole.admin, userRole.user), paymentController.createCheckout);
paymentRoutes.post(
    '/webhook/stripe',
    express.raw({ type: 'application/json' }),
    paymentController.stripeWebhook
);
export default paymentRoutes;