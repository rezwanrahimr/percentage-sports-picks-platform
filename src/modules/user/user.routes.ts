import express from 'express';
import userController from './user.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';
import { upload } from '../../util/uploadImgToCloudinary';

const userRoutes = express.Router();

// create user route
userRoutes.post('/create-user', auth(userRole.admin), upload.fields([
    { name: 'images', maxCount: 1 },
]), userController.createUser);

// update user
userRoutes.put('/update-user/:id', auth(userRole.admin, userRole.user), upload.fields([
    { name: 'images', maxCount: 1 },
]), userController.updateUser);


userRoutes.get('/get-user/:id', auth(userRole.admin, userRole.user), userController.getUserById);

userRoutes.delete('/delete-user/:id', auth(userRole.admin), userController.deleteUser);

userRoutes.get('/get-all-users', auth(userRole.admin, userRole.user), userController.getAllUsers);

export default userRoutes;
