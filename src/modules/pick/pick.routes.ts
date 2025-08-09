import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';
import pickController from './pick.controller';

const pickRoutes = express.Router();

/* sport type routes */
pickRoutes.post('/sport-type', auth(userRole.admin), pickController.createSportType);
pickRoutes.put('/sport-type/:id', auth(userRole.admin), pickController.updateSportType);
pickRoutes.get('/sport-type/:id', auth(userRole.admin), pickController.getSportTypeById);
pickRoutes.get('/sport-types', auth(userRole.admin), pickController.getSportTypes);
pickRoutes.delete('/sport-type/:id', auth(userRole.admin), pickController.deleteSportType);

/* league routes */
pickRoutes.post('/league', auth(userRole.admin), pickController.createLeague);
pickRoutes.put('/league/:id', auth(userRole.admin), pickController.updateLeague);
pickRoutes.get('/league/:id', auth(userRole.admin), pickController.getLeagueById);
pickRoutes.get('/leagues', auth(userRole.admin), pickController.getLeagues);
pickRoutes.delete('/league/:id', auth(userRole.admin), pickController.deleteLeague);

export default pickRoutes;