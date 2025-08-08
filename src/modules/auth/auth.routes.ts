import express from 'express';
import authController from './auth.controller';
import validator from '../../middleware/validator';
import { googleLoginValidator, logInValidator, sendVerificationEmailValidator } from './auth.validator';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';

const authRouter = express.Router();

authRouter.post('/send-verification-email', validator(sendVerificationEmailValidator), authController.sendVerificationEmail);

// Email login
authRouter.post('/logIn', validator(logInValidator), authController.logIn);

// Google login
authRouter.post('/google-login', validator(googleLoginValidator), authController.googleLogin);

// Apple login
authRouter.post('/apple-login', validator(googleLoginValidator), authController.appleLogin);

authRouter.post(
  '/logOut',
  auth(userRole.admin, userRole.user),
  authController.logOut,
);
authRouter.get('/profile', authController.collectProfileData);

export default authRouter;
