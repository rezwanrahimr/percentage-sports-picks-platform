import mongoose, { ClientSession, Types } from 'mongoose';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import idConverter from '../../util/idConvirter';
import { uploadToCloudinary } from '../../util/uploadImgToCloudinary';


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
        imageUrl = await uploadToCloudinary(image.path, 'profile/images');
      }

      user = new UserModel({ ...payload, img: imageUrl });
      await user.save({ session });

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

  let imageUrl = null;
  if (image) {
    imageUrl = await uploadToCloudinary(image.path, 'profile/images');
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
