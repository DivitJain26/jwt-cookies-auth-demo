import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";
import { getEnv } from '../utils/env.js'
import { generateTokens } from 'utils/token.js';
import { CookieOptions, SameSiteOption, setTokenCookies } from 'utils/cookies.js';

import { ErrorResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshTokenRequest, RefreshTokenResponse, LogoutResponse, AuthenticatedRequest, SuccessResponse } from '../types/auth.types'

export const register = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse | ErrorResponse>
): Promise<Response | void> => {
    try {
        // console.log(req.body); 
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(402).json({ error: 'User already exists' });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(403).json({ error: 'Password must be at least 6 characters long' });
        }

        // create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(newUser._id);

        // Save refresh token to user
        newUser.refreshToken = refreshToken;
        newUser.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.log(`Regestration Error ${error}`);
        res.status(500).json({ error: `Regestration Error ${error}` });
    }
}

export const login = async (
    req: Request<{}, {}, LoginRequest>,
    res: Response<LoginResponse | ErrorResponse>
): Promise<Response | void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(402).json({ error: "Invalid credentials" });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(402).json({ error: "Invalid credentials" });
        }

        // Generate token
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        const { _id, name, email: userEmail, role } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: _id,
                name: name,
                email: userEmail,
                role: role,
            }
        });

    } catch (error) {
        console.log(`Login Error ${error}`);
        res.status(400).json({ error: 'Login failed' });
    }
}

// Refresh token
export const refreshToken = async (
    req: RefreshTokenRequest,
    res: Response<RefreshTokenResponse | ErrorResponse>,
    next: NextFunction
): Promise<Response | void> => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, getEnv('JWT_REFRESH_TOKEN_SECRET')) as jwt.JwtPayload & { id: string };

        // Find user with matching refresh token
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        // Generate new tokens
        const tokens = generateTokens(user._id);

        // Update refresh token in database
        user.refreshToken = tokens.refreshToken;
        await user.save();

        // Set new cookies
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
        });

    } catch (error: unknown) {
        console.log(`Refresh Token Error ${error}`);
        if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
            res.status(401).json({ error: `Refresh Token Error ${error}` });
        } else {
            // Pass other errors to the error handler middleware
            next(error);
        }
    }
}

export const logout = async (
    req: RefreshTokenRequest,
    res: Response<LogoutResponse | ErrorResponse>
): Promise<Response | void> => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (refreshToken) {
            // Find user with this refresh token and clear it
            await User.findOneAndUpdate(
                { refreshToken },
                { $set: { refreshToken: '' } },
                { new: true } // Return the modified document
            );
        }

        const baseCookieOptions: CookieOptions = {
            httpOnly: true,
            secure: getEnv('NODE_ENV') === 'production',
            maxAge: 0, // Set maxAge to 0 to delete the cookie
        }

        // Clear cookies
        res.clearCookie('accessToken', {
            ...baseCookieOptions,
            sameSite: getEnv('ACCESS_TOKEN_COOKIE_SAME_SITE') as SameSiteOption,
        });

        res.clearCookie('refreshToken', {
            ...baseCookieOptions,
            sameSite: getEnv('REFRESH_TOKEN_COOKIE_SAME_SITE') as SameSiteOption,
            path: '/api/auth/refresh',
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.log(`Logout Error ${error}`);
        res.status(400).json({ error: `Logout Error ${error}` });
    }
}

// Get current user
export const getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response<SuccessResponse | ErrorResponse>
): Promise<Response | void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: 'Unauthorized - User not authenticated' });
            return;
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User found',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(`Get user Error ${error}`);
        res.status(400).json({ error: `Get user Error ${error}` });
    }
};