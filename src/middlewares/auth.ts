import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import config from '../config';
import { catchAsync } from '../utils/catchAsync.js';
import { jwtUtils } from '../utils/jwt.js';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error('Unauthorized! Please login first.');
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, email, role, name } = verifiedToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Your account has been suspended.');
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new Error(
        'Forbidden. You are not allowed to access this resource.'
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  });
};
