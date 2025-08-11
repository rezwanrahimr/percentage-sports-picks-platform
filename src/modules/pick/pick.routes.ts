import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';
import pickController from './pick.controller';
import { upload } from '../../util/uploadImgToCloudinary';

const pickRoutes = express.Router();

/* sport type routes */
pickRoutes.post('/sport-type', auth(userRole.admin), pickController.createSportType);
pickRoutes.patch('/sport-type/:id', auth(userRole.admin), pickController.updateSportType);
pickRoutes.get('/sport-type/:id', auth(userRole.admin), pickController.getSportTypeById);
pickRoutes.get('/sport-types', auth(userRole.admin), pickController.getSportTypes);
pickRoutes.delete('/sport-type/:id', auth(userRole.admin), pickController.deleteSportType);

/* league routes */
pickRoutes.post('/league', auth(userRole.admin), pickController.createLeague);
pickRoutes.patch('/league/:id', auth(userRole.admin), pickController.updateLeague);
pickRoutes.get('/league/:id', auth(userRole.admin), pickController.getLeagueById);
pickRoutes.get('/leagues', auth(userRole.admin), pickController.getLeagues);
pickRoutes.delete('/league/:id', auth(userRole.admin), pickController.deleteLeague);

/* teaser types routes */
pickRoutes.post('/teaser-type', auth(userRole.admin), pickController.createTeaserType);
pickRoutes.patch('/teaser-type/:id', auth(userRole.admin), pickController.updateTeaserType);
pickRoutes.get('/teaser-type/:id', auth(userRole.admin), pickController.getTeaserTypeById);
pickRoutes.get('/teaser-types', auth(userRole.admin), pickController.getTeaserTypes);
pickRoutes.delete('/teaser-type/:id', auth(userRole.admin), pickController.deleteTeaserType);


/* team routes */
pickRoutes.post('/team', auth(userRole.admin), upload.fields([
    { name: 'images', maxCount: 1 },
]), pickController.createTeam);
pickRoutes.patch('/team/:id', auth(userRole.admin), upload.fields([
    { name: 'images', maxCount: 1 },
]), pickController.updateTeam);
pickRoutes.get('/team/:id', auth(userRole.admin), pickController.getTeamById);
pickRoutes.get('/teams', auth(userRole.admin), pickController.getTeams);
pickRoutes.delete('/team/:id', auth(userRole.admin), pickController.deleteTeam);

export default pickRoutes;