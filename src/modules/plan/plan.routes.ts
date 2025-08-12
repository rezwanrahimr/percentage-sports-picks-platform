import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';
import planController from './plan.controller';

const planRoutes = express.Router();

planRoutes.post('/plan', auth(userRole.admin), planController.createPlan);
planRoutes.patch('/plan/:id', auth(userRole.admin), planController.updatePlan);
planRoutes.get('/plan/:id', auth(userRole.admin), planController.getPlanById);
planRoutes.get('/plan', auth(userRole.admin), planController.getPlans);
planRoutes.delete('/plan/:id', auth(userRole.admin), planController.deletePlan);


export default planRoutes;