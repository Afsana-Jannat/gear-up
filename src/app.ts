import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './config/index.js';

import { userRoutes } from './modules/user/user.route.js';
import { authRoutes } from './modules/auth/auth.route.js';
import { categoryRoutes } from './modules/category/category.route.js';
import { gearRoutes } from './modules/gear/gear.route.js';
import { rentalRoutes } from './modules/rental/rental.route.js';
import { reviewRoutes } from './modules/review/review.route.js';
import { paymentRoutes } from './modules/payment/payment.route.js';
import { adminRoutes } from './modules/admin/admin.route.js';
import { providerRoutes } from './modules/provider/provider.route.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { notFound } from './middlewares/notFound.js';

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

app.use(notFound);

app.use(globalErrorHandler);

export default app;
