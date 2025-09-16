import mongoose, { ClientSession, Types } from 'mongoose';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import idConverter from '../../util/idConvirter';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';
import NotificationHelper from '../notifications/notification-helper.service';
import { sendEmail } from '../../util/sendEmail';


const createUser = async (payload: Partial<TUser>, image?: Express.Multer.File) => {
  const existingUser = await UserModel.findOne({ email: payload.email });

  if (existingUser) {
    return {
      message: "A user with this email already exists and is active.",
      data: null,
    };
  }

  const session: ClientSession = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      let user;
      let imageUrl = null;

      if (image) {
        // Assuming uploadToCloudinary is your function for uploading to Cloudinary
        imageUrl = await uploadToCloudinary(image.buffer, 'profile/images', image.originalname);
      }

      user = new UserModel({ ...payload, img: imageUrl });
      await user.save({ session });

      const sendWelcomeNotification = await NotificationHelper.notifyUserWelcome(
        user.id);

      if (payload.email) {
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
                <p class="welcome-text">Hello ${payload.name || 'there'}!</p>
                <p>We're excited to have you join our community. Your account has been successfully created.</p>
                
                <div class="user-info">
                  <h3>Account Details:</h3>
                  <p><strong>Email:</strong> ${payload.email}</p>
                  <p><strong>Name:</strong> ${payload.name || 'Not provided'}</p>
                  <p><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>You can now start exploring all the features our platform has to offer.</p>
                
                <a href="${process.env.FRONTEND_URL || 'https://yourwebsite.com'}/login" class="btn">Get Started</a>
                
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

        await sendEmail(payload.email, "Welcome to Our Platform!", welcomeEmailHTML);
      }

      return {
        message: "User created successfully.",
        data: user,
      };
    });

    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      message: "User creation failed due to an internal error.",
      data: null,
    };
  } finally {
    session.endSession();
  }
};


const updateUser = async (userId: string, userData: Partial<TUser>, image?: Express.Multer.File) => {
  const userIdConverted = idConverter(userId);
  if (!userIdConverted) {
    throw new Error("User ID conversion failed");
  }

  if (userData?.email || userData?.role) {
    throw new Error("Email and role cannot be updated");
  }

  let imageUrl: string | undefined = undefined;
  if (image) {
    imageUrl = await uploadToCloudinary(image.buffer, 'profile/images', image.originalname) as string;
    userData.img = imageUrl;
  }

  const result = await UserModel.findByIdAndUpdate(userIdConverted, userData, { new: true });
  if (!result) {
    throw new Error("User not found or update failed");
  }

  return result;
};


const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const getAllUsers = async () => {
  const result = await UserModel.find();
  return result;
}


const deleteSingleUser = async (user_id: Types.ObjectId) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    await UserModel.findOneAndUpdate({ _id: user_id }, { isDeleted: true, email: null }, { session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const selfDistuct = async (user_id: Types.ObjectId) => {
  const result = deleteSingleUser(user_id)
  return result;
}




const userServices = {
  createUser,
  getAllUsers,
  deleteSingleUser,
  selfDistuct,
  updateUser,
  getUserById
};

export default userServices;
