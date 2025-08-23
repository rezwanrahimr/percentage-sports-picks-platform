import { config } from '../../config';
import authUtill from './auth.utill';
import { UserModel } from '../user/user.model';
import { sendEmail } from '../../util/sendEmail';
import userServices from '../user/user.service';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from "apple-signin-auth";
import VerificationCodeModel from './verificationCode.model';
import NotificationHelper from '../notifications/notification-helper.service';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendVerificationEmail = async (email: string) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const subject = "Your Email Verification Code";

  const html = `
    <div>
      <h2>Email Verification</h2>
      <p>Your code is:</p>
      <p style="font-size: 24px; font-weight: bold;">${verificationCode}</p>
      <p>This will expire in 10 minutes.</p>
    </div>
  `;

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


  // Upsert the verification code into MongoDB
  await VerificationCodeModel.findOneAndUpdate(
    { email },
    { code: verificationCode, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const response = await sendEmail(email, subject, html);

  return {
    ...response
  };
}


const logIn = async (
  email: string,
  code: string
) => {
  let user = await UserModel.findOne({ email });
  let verificationCode = await VerificationCodeModel.find({ email, code });


  if (verificationCode?.[0].expiresAt && verificationCode[0].expiresAt < new Date()) {
    throw new Error('This verification code has expired');
  } else {

    if (!verificationCode || verificationCode.length === 0) {
      throw new Error('Invalid verification code');
    }

  }

  if (!user && verificationCode.length > 0) {
    const newUserResponse = await userServices.createUser({
      email,
      name: email.split('@')[0],
      provider: 'email',
      isNotificationEnabled: true,
      isLoggedIn: true
    }, undefined);


    if (!newUserResponse.data) {
      throw new Error(newUserResponse.message || 'User creation failed');
    }


    const sendWelcomeNotification = await NotificationHelper.notifyUserWelcome(
      newUserResponse?.data?._id?.toHexString());

    if (email) {
      // HTML email content
      const welcomeEmailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4CAF50; color: white; text-align: center; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
              .welcome-text { font-size: 18px; margin-bottom: 20px; }
              .user-info { background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; }
              .btn { background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Our Platform!</h1>
              </div>
              <div class="content">
                <p class="welcome-text">Hello ${email?.split('@')[0] || 'there'}!</p>
                <p>We're excited to have you join our community. Your account has been successfully created.</p>
                
                <div class="user-info">
                  <h3>Account Details:</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Name:</strong> ${email?.split('@')[0] || 'Not provided'}</p>
                  <p><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>You can now start exploring all the features our platform has to offer.</p>
                
                <p>If you have any questions, feel free to reach out to our support team.</p>
                
                <div class="footer">
                  <p>Thank you for choosing our platform!</p>
                  <p><small>This is an automated email. Please do not reply to this message.</small></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

      await sendEmail(email, "Welcome to Our Platform!", welcomeEmailHTML);
    }


    user = newUserResponse.data;
  } else {
    if (user) {
      user.isLoggedIn = true;
      await user.save();
    }
  }



  const tokenizeData = {
    id: user?._id.toHexString(),
    role: user?.role,
    username: user?.name,
  };

  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn,
  );

  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn,
  );

  return { approvalToken, refreshToken, updatedUser: user };
};


const googleLogin = async (name: string, email: string) => {

  if (!email) {
    throw new Error('Email is required for Google login');
  }

  let user = await UserModel.findOne({ email, provider: 'google' });

  if (!user) {
    user = await UserModel.create({
      name: name || email.split('@')[0],
      email,
      provider: 'google',
      isLoggedIn: true
    });
  } else {
    user.isLoggedIn = true;
    await user.save();
  }

  const tokenizeData = {
    id: user._id.toHexString(),
    role: user.role,
    username: user.name,
  };

  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn,
  );

  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn,
  );

  return { approvalToken, refreshToken, updatedUser: user };

}

const appleLogin = async (idToken: string) => {
  const decoded = await appleSignin.verifyIdToken(idToken, {
    audience: process.env.APPLE_CLIENT_ID,
    ignoreExpiration: true
  });

  const { sub, email } = decoded;

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      name: "",
      email,
      provider: "apple",
      providerId: sub
    });
  }

  const tokenizeData = {
    id: user._id.toHexString(),
    role: user.role,
    username: user.name,
  };

  const approvalToken = authUtill.createToken(
    tokenizeData,
    config.jwt_token_secret,
    config.token_expairsIn,
  );

  const refreshToken = authUtill.createToken(
    tokenizeData,
    config.jwt_refresh_Token_secret,
    config.rifresh_expairsIn,
  );

  return { approvalToken, refreshToken, updatedUser: user };
};

const logOut = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Perform logout operations (e.g., invalidate tokens, update user status)
  await UserModel.findByIdAndUpdate(userId, { isLoggedIn: false, loggedOutTime: new Date() });

  return { success: true, message: 'Logged out successfully' };
};

const collectProfileData = async (id: string) => {
  const result = await UserModel.findOne({ _id: id });
  return result;
};

const authServices = {
  logIn,
  logOut,
  collectProfileData,
  sendVerificationEmail,
  googleLogin,
  appleLogin
};
export default authServices;
