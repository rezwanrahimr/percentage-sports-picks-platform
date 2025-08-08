import catchAsync from '../../util/catchAsync';
import authServices from './auth.service';


const sendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authServices.sendVerificationEmail(email);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully',
    body: result,
  });
})

// email login
const logIn = catchAsync(async (req, res) => {
  const { email, code } = req.body;
  const result = await authServices.logIn(email, code);
  const { approvalToken, refreshToken, updatedUser } = result;

  res.status(200).json({
    success: true,
    message: 'Log In Successful',
    approvalToken: approvalToken,
    refreshToken: refreshToken,
    user: updatedUser,
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const result = await authServices.googleLogin(idToken);
  res.status(200).json({
    message: 'Google Login Successful',
    approvalToken: result.approvalToken,
    refreshToken: result.refreshToken,
    user: result.updatedUser,
  });
});

const appleLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const result = await authServices.appleLogin(idToken);
  res.status(200).json({
    message: 'Apple Login Successful',
    approvalToken: result.approvalToken,
    refreshToken: result.refreshToken,
    user: result.updatedUser,
  });
});

const logOut = catchAsync(async (req, res) => {
  const userId = req?.user.id;

  if (!userId) {
    throw Error('token is missing');
  }

  const result = await authServices.logOut(userId);
  res.status(200).json({
    success: true,
    message: 'Log OUT Successful',
  });
});


const collectProfileData = catchAsync(async (req, res) => {
  const user = req.user
  const result = await authServices.collectProfileData(user.id);
  res.status(200).json({
    success: true,
    message: 'password changed',
    body: result,
  });
});

const authController = {
  logIn,
  googleLogin,
  logOut,
  collectProfileData,
  sendVerificationEmail,
  appleLogin
};
export default authController;
