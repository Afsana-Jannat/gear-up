import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './config';

import { userRoutes } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { categoryRoutes } from './modules/category/category.route';
import { gearRoutes } from './modules/gear/gear.route';
import { rentalRoutes } from './modules/rental/rental.route';
import { reviewRoutes } from './modules/review/review.route';
import { paymentRoutes } from './modules/payment/payment.route';
import { adminRoutes } from './modules/admin/admin.route';
import { providerRoutes } from './modules/provider/provider.route';

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('GearUp API Running...');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/provider', providerRoutes);

export default app;
