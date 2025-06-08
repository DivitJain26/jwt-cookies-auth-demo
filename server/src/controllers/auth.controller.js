import jwt from "jsonwebtoken";
import ms from "ms";
import User from "../models/user.model.js";
import e from "express";

// Generate tokens
const generateTokens = (userId) => {
    // Access token
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    )

    // Refresh token
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
}

// Set cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
    // Set access token in cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: ms(process.env.ACCESS_TOKEN_COOKIE_EXPIRES_IN),
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: ms(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN),
        path: '/api/auth/refresh', // Only sent to refresh endpoint
    });
};

export const register = async (req, res) => {
    try {
        // console.log(req.body); 
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(402).json({ user: existingUser, error: 'User already exists' });
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password')
        
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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.log(`Login Error ${error}`);
        res.status(400).json({ error: 'Login failed' });
    }
}

// Refresh token
export const refreshToken = async (req, res, next) => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

        // Find user with matching refresh token
        const user = await User.findById(decoded.id).select('+refreshToken');;

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

    } catch (error) {
        console.log(`Refresh Token Error ${error}`);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(401).json({ error: `Refresh Token Error ${error}` });
        }
    }
}

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            // Find user with this refresh token and clear it
            await User.findOneAndUpdate(
                { refreshToken },
                { $set: { refreshToken: '' } }
            );
        }

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

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
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            success: true,
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