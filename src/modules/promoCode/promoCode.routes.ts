import express from 'express';
import auth from '../../middleware/auth';
import { userRole } from '../../constents';
import planController from './promoCode.controller';

const promoCodeRoutes = express.Router();

promoCodeRoutes.post('/promo-code', auth(userRole.admin), planController.createPromoCode);
promoCodeRoutes.patch('/promo-code/:id', auth(userRole.admin), planController.updatePromoCode);
promoCodeRoutes.get('/promo-code/:id', auth(userRole.admin,userRole.user), planController.getPromoCodeById);
promoCodeRoutes.get('/promo-codes', auth(userRole.admin,userRole.user), planController.getPromoCodes);
promoCodeRoutes.delete('/promo-code/:id', auth(userRole.admin), planController.deletePromoCode);

export default promoCodeRoutes;