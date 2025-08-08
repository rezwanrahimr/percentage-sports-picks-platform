import express from 'express';
import userController from './user.controller';
import { userRole } from '../../constents';
import auth from '../../middleware/auth';

const userRoutes = express.Router();

// create user route
userRoutes.post('/create-user', userController.createUser);

// update user
userRoutes.put('/update-user/:id', auth(userRole.admin, userRole.user), userController.updateUser);

export default userRoutes;
