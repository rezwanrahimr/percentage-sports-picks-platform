import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import userServices from './user.service';

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  const imgFile = req.files && (req.files as any).images
    ? (req.files as any).images[0]
    : null;

  const result = await userServices.createUser(user, imgFile);
  res.status(200).json({
    message: result.message || 'user created successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  const imgFile = req.files && (req.files as any).images
    ? (req.files as any).images[0]
    : null;

  if (!userId || !userData) {
    throw new Error('User ID and data are required for update.');
  }

  const result = await userServices.updateUser(userId, userData, imgFile);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: result,
  });
})

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userServices.getUserById(id);
  res.status(200).json({
    success: true,
    message: "user retrieved successfully",
    data: {
      user: result
    }
  });
})


const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users',
    data: result,
  });
});

import { Types } from 'mongoose';

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const objectId = new Types.ObjectId(id);

  const result = await userServices.deleteSingleUser(objectId);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};


export default userController;
