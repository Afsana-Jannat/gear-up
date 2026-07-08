import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from './config';

import { userRoutes } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { categoryRoutes } from './modules/category/category.route';
import { gearRoutes } from './modules/gear/gear.route';

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

export default app;
