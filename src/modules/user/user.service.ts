import mongoose, { ClientSession, Types } from 'mongoose';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import idConverter from '../../util/idConvirter';

const createUser = async (payload: Partial<TUser>, method?: string) => {

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

      if (method) {
        const { ...rest } = payload;
        const created = await UserModel.create([rest], { session });
        user = created[0];
      } else {
        user = new UserModel(payload);
        await user.save({ session });
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

const updateUser = async (userId: string, userData: Partial<TUser>) => {
  const userIdConverted = idConverter(userId);
  if (!userIdConverted) {
    throw new Error("User ID conversion failed");
  }

  if (userData?.email || userData?.role) {
    throw new Error("Email and role cannot be updated");
  }

  const result = await UserModel.findByIdAndUpdate(userIdConverted, userData, { new: true });
  if (!result) {
    throw new Error("User not found or update failed");
  }
  return result;
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
  updateUser
};

export default userServices;
