import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model.ts';
import { getEnv } from '../utils/env.ts';


interface AuthenticatedRequest extends Request {
    user?: Pick<IUser, 'id' | 'role'>;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        // Get token from cookie
        const token = req.cookies.accessToken;

        // Check if token exists
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return 
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, getEnv('JWT_ACCESS_TOKEN_SECRET')) as { id: string };

            // console.log('req.user:', req.user);

            // Get user role
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(401).json({ error: 'User not found' });
                return 
            }

            req.user = {
                id: decoded.id,
                role: user.role,
            }

            next();
        } catch (error: any) {
            // If token is expired, try to use refresh token
            console.log(`Authenticate Error: ${error}`);
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ error: 'Token expired' });
                return 
            }
            res.status(401).json({ error: 'Invalid token' });
            return 
        }
    } catch (error) {
        next(error);
    }
}

// export const authorize = (roles: string[] = []) => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (roles.length && !roles.includes(req.user.role!)) {
//       return res.status(403).json({ error: 'Not authorized for this action' });
//     }

//     next();
//   };
// };