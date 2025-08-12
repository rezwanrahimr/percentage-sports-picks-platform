import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import pickRoutes from '../modules/pick/pick.routes';
import planRoutes from '../modules/plan/plan.routes';
import promoCodeRoutes from '../modules/promoCode/promoCode.routes';

const Routes = express.Router();
// Array of module routes
const moduleRouts = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router: userRoutes,
  },
  {
    path: '/picks',
    router: pickRoutes
  },
  {
    path: '/plans',
    router: planRoutes
  },
  {
    path: '/promo-codes',
    router: promoCodeRoutes
  }
];

moduleRouts.forEach(({ path, router }) => {
  Routes.use(path, router);
});

export default Routes;
