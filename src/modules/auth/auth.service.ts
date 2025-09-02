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
<!doctype html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Email Verification</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; color:#111827; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; }
    .wrap { width:100%; padding:24px 12px; }
    .card { max-width:640px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 10px 30px rgba(0,0,0,.06); overflow:hidden; }
    .header { background:linear-gradient(135deg,#6a5af9,#22d3ee); color:#fff; text-align:center; padding:28px 24px; }
    .header h1 { margin:0; font-size:24px; }
    .content { padding:32px 28px; }
    .muted { color:#6b7280; }
    .code { display:inline-block; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace; font-size:32px; font-weight:800; letter-spacing:6px; background:#f1f5f9; color:#111827; padding:12px 18px; border-radius:10px; border:1px solid #e5e7eb; }
    .footer { padding:18px 24px; text-align:center; color:#9ca3af; font-size:12px; }
    .preheader { display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; }
    @media (prefers-color-scheme: dark) {
      body { background:#0b1020; color:#e5e7eb; }
      .card { background:#111827; }
      .code { background:#0b1020; color:#e5e7eb; border-color:#1f2937; }
      .muted, .footer { color:#9ca3af; }
    }
  </style>
</head>
<body>
  <span class="preheader">Your verification code is ${verificationCode}. It expires in 5 minutes.</span>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <h1>Verify your email</h1>
        <p style="margin:6px 0 0; opacity:.95;">Use the code below to continue</p>
      </div>
      <div class="content">
        <p class="muted">Enter this 6‑digit code in the app. This code expires in 5 minutes.</p>
        <div style="margin:16px 0 24px;">
          <span class="code">${verificationCode}</span>
        </div>
        <p class="muted" style="margin-top:0;">If you didn’t request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
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

const appleLogin = async (name: string, email: string) => {
  if (!email) {
    throw new Error('Email is required for Apple login');
  }

  let user = await UserModel.findOne({ email, provider: 'apple' });


  if (!user) {
    user = await UserModel.create({
      name: name || email.split('@')[0],
      email,
      provider: 'apple',
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
