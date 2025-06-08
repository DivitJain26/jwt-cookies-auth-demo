import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    try {
        
        // Get token from cookie
        const token = req.cookies.accessToken;
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

            // Add user from payload to request object
            req.user = { id: decoded.id };
            
            // console.log('req.user:', req.user);

            // Get user role
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
  
            req.user.role = user.role;

            next();
        } catch (error) {
            // If token is expired, try to use refresh token
            console.log(`Authenticate Error: ${error}`);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        next(error);
    }
}

// export const authorize = (roles = []) => {
//     return (req, res, next) => {
//         // If roles is a string, convert it to an array
//         if (!req.user) {
//             return next(401).json({ error: 'Unauthorized' });
//         }

//         if (roles.length && !roles.includes(req.user.role)) {  
//             return next(403).json({ error: 'Not authorized for this action' });
//         }

//         next();
//     } 
// }