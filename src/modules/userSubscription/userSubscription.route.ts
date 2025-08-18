import express from 'express';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';
import userSubscriptionController from './userSubscription.controller';

const userSubscriptionRoutes = express.Router();

userSubscriptionRoutes.get('/get-subscription/:userId', auth(userRole.admin, userRole.user), userSubscriptionController.getUserById);

userSubscriptionRoutes.get('/get-total-subscriber', auth(userRole.admin, userRole.user), userSubscriptionController.getTotalSubscribers);

userSubscriptionRoutes.get('/active-subscriber', auth(userRole.admin, userRole.user), userSubscriptionController.getActiveSubscribers);

export default userSubscriptionRoutes;
